import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')

loadDotEnv(path.join(rootDir, '.env'))

const port = Number(process.env.PORT ?? 3001)

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function loadDotEnv(filePath) {
  if (!existsSync(filePath)) {
    return
  }

  const envFile = readFileSync(filePath, 'utf8')

  for (const rawLine of envFile.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()

    if (!key || process.env[key] !== undefined) {
      continue
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    process.env[key] = value
  }
}

async function fetchFeaturedEdits() {
  const token = process.env.DISCORD_BOT_TOKEN ?? ''
  const channelId = process.env.DISCORD_CHANNEL_ID ?? ''
  const guildId = process.env.DISCORD_GUILD_ID ?? ''

  if (!token || !channelId) {
    return {
      status: 500,
      body: {
        message:
          'Missing DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ID in your environment variables.',
      },
    }
  }

  const response = await fetch(
    `https://discord.com/api/v10/channels/${channelId}/messages?limit=50`,
    {
      headers: {
        Authorization: `Bot ${token}`,
      },
    },
  )

  if (!response.ok) {
    return {
      status: response.status,
      body: {
        message: 'Discord API request failed.',
        status: response.status,
        details: await response.text(),
      },
    }
  }

  const messages = await response.json()
  const edits = messages.flatMap((message) => {
    return message.attachments
      .filter((attachment) => {
        const contentType = attachment.content_type ?? ''
        return contentType.startsWith('video/')
      })
      .map((attachment) => ({
        id: `${message.id}-${attachment.id}`,
        title: message.content?.trim() || attachment.filename,
        videoUrl: attachment.url,
        messageUrl: guildId
          ? `https://discord.com/channels/${guildId}/${channelId}/${message.id}`
          : '',
      }))
  })

  return {
    status: 200,
    body: edits,
  }
}

async function serveStaticAsset(requestPath, response) {
  const normalizedPath = requestPath === '/' ? '/index.html' : requestPath
  const resolvedPath = path.resolve(distDir, `.${normalizedPath}`)

  if (!resolvedPath.startsWith(distDir)) {
    response.writeHead(403)
    response.end('Forbidden')
    return true
  }

  const assetPath = (await fileExists(resolvedPath)) ? resolvedPath : path.join(distDir, 'index.html')

  if (!(await fileExists(assetPath))) {
    return false
  }

  const extension = path.extname(assetPath)
  response.writeHead(200, {
    'Content-Type': contentTypes[extension] ?? 'application/octet-stream',
  })
  createReadStream(assetPath).pipe(response)
  return true
}

async function fileExists(filePath) {
  try {
    const info = await stat(filePath)
    return info.isFile()
  } catch {
    return false
  }
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host}`)

  if (request.method === 'GET' && requestUrl.pathname === '/api/discord/featured-edits') {
    response.setHeader('Content-Type', 'application/json; charset=utf-8')

    try {
      const result = await fetchFeaturedEdits()
      response.writeHead(result.status)
      response.end(JSON.stringify(result.body))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      response.writeHead(500)
      response.end(
        JSON.stringify({
          message: 'Unexpected server error while fetching Discord videos.',
          details: message,
        }),
      )
    }

    return
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405)
    response.end('Method Not Allowed')
    return
  }

  const served = await serveStaticAsset(requestUrl.pathname, response)

  if (!served) {
    response.writeHead(404)
    response.end('Not Found')
  }
})

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})