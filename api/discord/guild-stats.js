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
    // .env can be omitted in hosted deployments that inject runtime environment vars.
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
  const guildId = getEnvValue('DISCORD_GUILD_ID');

  if (!token || !guildId) {
    return res.status(500).json({
      message: 'Missing DISCORD_BOT_TOKEN or DISCORD_GUILD_ID in your environment variables.',
    });
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
      {
        headers: {
          Authorization: `Bot ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        message: 'Discord API request for guild stats failed.',
        status: response.status,
        details: errorText,
      });
    }

    const guild = await response.json();

    return res.status(200).json({
      memberCount: guild.approximate_member_count ?? 0,
      onlineCount: guild.approximate_presence_count ?? 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Unexpected server error while fetching Discord guild stats.',
      details: error.message,
    });
  }
}
