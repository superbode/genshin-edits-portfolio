import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function attachExpressLikeHelpers(res: import('node:http').ServerResponse) {
  const response = res as import('node:http').ServerResponse & {
    status?: (code: number) => typeof response
    json?: (body: unknown) => typeof response
  }

  response.status = (code: number) => {
    response.statusCode = code
    return response
  }

  response.json = (body: unknown) => {
    if (!response.headersSent) {
      response.setHeader('Content-Type', 'application/json')
    }

    response.end(JSON.stringify(body))
    return response
  }

  return response
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-featured-edits-api',
      configureServer(server) {
        server.middlewares.use('/api/discord/featured-edits', async (req, res) => {
          if (req.method !== 'GET') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Method not allowed' }))
            return
          }

          // Vite config runs in Node and can load the JS API handler directly.
          // @ts-expect-error API route is plain JS and intentionally has no TS types.
          const mod = await import('./api/discord/featured-edits.js')
          const handler = mod.default as (req: unknown, res: unknown) => Promise<unknown>
          await handler(req, attachExpressLikeHelpers(res))
        })

        server.middlewares.use('/api/discord/guild-stats', async (req, res) => {
          if (req.method !== 'GET') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Method not allowed' }))
            return
          }

          // @ts-expect-error API route is plain JS and intentionally has no TS types.
          const mod = await import('./api/discord/guild-stats.js')
          const handler = mod.default as (req: unknown, res: unknown) => Promise<unknown>
          await handler(req, attachExpressLikeHelpers(res))
        })
      },
    },
  ],
})
