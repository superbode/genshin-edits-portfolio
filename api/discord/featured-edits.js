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

function parseMessageContent(content) {
    const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    let videoUrl = '';
    let title = '';
    let author = '';
    let discordHandle = '';
    let tiktokHandle = '';
    let instagramHandle = '';

    for (const line of lines) {
        const titleMatch = line.match(/^title\s*:\s*(.*)$/i);
        if (titleMatch) {
            title = titleMatch[1].trim();
            continue;
        }

        const authorMatch = line.match(/^author\s*:\s*(.*)$/i);
        if (authorMatch) {
            author = authorMatch[1].trim();
            continue;
        }

        const discordMatch = line.match(/^discord\s*:\s*(.*)$/i);
        if (discordMatch) {
            discordHandle = discordMatch[1].trim();
            continue;
        }

        const tiktokMatch = line.match(/^tiktok\s*:\s*(.*)$/i);
        if (tiktokMatch) {
            tiktokHandle = tiktokMatch[1].trim();
            continue;
        }

        const instagramMatch = line.match(/^instagram\s*:\s*(.*)$/i);
        if (instagramMatch) {
            instagramHandle = instagramMatch[1].trim();
            continue;
        }

        if (!videoUrl) {
            const urlMatch = line.match(/https?:\/\/\S+/i);
            if (urlMatch) {
                videoUrl = urlMatch[0];
            }
        }
    }

    return {
        videoUrl,
        title,
        author,
        discordHandle,
        tiktokHandle,
        instagramHandle,
    };
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
            const parsedContent = parseMessageContent(message.content ?? '');
            const videoAttachments = message.attachments.filter((attachment) => {
                const contentType = attachment.content_type ?? '';
                return contentType.startsWith('video/');
            });

            const messageUrl = guildId
                ? `https://discord.com/channels/${guildId}/${channelId}/${message.id}`
                : '';

            if (parsedContent.videoUrl) {
                return [{
                    id: message.id,
                    title: parsedContent.title || '',
                    author: parsedContent.author || '',
                    discordHandle: parsedContent.discordHandle || '',
                    tiktokHandle: parsedContent.tiktokHandle || '',
                    instagramHandle: parsedContent.instagramHandle || '',
                    videoUrl: parsedContent.videoUrl,
                    messageUrl,
                }];
            }

            return videoAttachments.map((attachment) => ({
                id: `${message.id}-${attachment.id}`,
                title: parsedContent.title || '',
                author: parsedContent.author || '',
                discordHandle: parsedContent.discordHandle || '',
                tiktokHandle: parsedContent.tiktokHandle || '',
                instagramHandle: parsedContent.instagramHandle || '',
                videoUrl: attachment.url,
                messageUrl,
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