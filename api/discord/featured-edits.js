import fs from 'node:fs';
import path from 'node:path';

let cachedDotEnv = null;

function loadDotEnvFallback() {
  if (cachedDotEnv) {
    return cachedDotEnv;
  }

  const envFilePath = path.resolve(process.cwd(), '.env');
  const parsed = {};

  try {
    const raw = fs.readFileSync(envFilePath, 'utf8');
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      parsed[key] = value;
    }
  } catch {
    // .env is optional in deployed environments where vars are injected by platform.
  }

  cachedDotEnv = parsed;
  return cachedDotEnv;
}

function getEnvValue(key) {
  if (process.env[key]) {
    return process.env[key];
  }

  const fallback = loadDotEnvFallback();
  return fallback[key] || '';
}

export default async function handler(req, res) {
  const token = getEnvValue('DISCORD_BOT_TOKEN');
  const channelId = getEnvValue('DISCORD_CHANNEL_ID');
  const guildId = getEnvValue('DISCORD_GUILD_ID');

  if (!token || !channelId) {
    return res.status(500).json({
      message: 'Missing DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ID in your environment variables.'
    });
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages?limit=50`,
      {
        headers: {
          Authorization: `Bot ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        message: 'Discord API request failed.',
        status: response.status,
        details: errorText,
      });
    }

    const messages = await response.json();

    const edits = messages.flatMap((message) => {
      return message.attachments
        .filter((attachment) => {
          const contentType = attachment.content_type ?? '';
          return contentType.startsWith('video/');
        })
        .map((attachment) => ({
          id: `${message.id}-${attachment.id}`,
          title: message.content?.trim() || attachment.filename,
          videoUrl: attachment.url,
          messageUrl: guildId
            ? `https://discord.com/channels/${guildId}/${channelId}/${message.id}`
            : '',
        }));
    });

    return res.status(200).json(edits);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Unexpected server error while fetching Discord videos.',
      details: error.message,
    });
  }
}