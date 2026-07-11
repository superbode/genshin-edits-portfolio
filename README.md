# kazuhas group Edit Portfolio

This is a Vite + React portfolio for sharing featured edits on the kazuhas group Discord server as well as information about the kazuhas group Discord.

## Scripts

- `npm run dev` starts the Vite client and the Node server together.
- `npm run build` type-checks and creates the production client build.
- `npm run start` runs the backend server, which serves the built app and API.
- `npm run lint` runs ESLint across the workspace.

## Discord Featured Edits

The Featured Edits page reads from `/api/discord/featured-edits`.

That endpoint is served by `server/server.mjs`, which:

- Uses `DISCORD_CHANNEL_ID` to fetch messages from a single Discord channel
- Extracts video attachments from those messages
- Returns the frontend card data as JSON
- Keeps `DISCORD_BOT_TOKEN` on the server only

### Environment variables

Create a local `.env` file and set:

- `DISCORD_BOT_TOKEN`: Discord bot token
- `DISCORD_CHANNEL_ID`: Channel ID to read featured edits from
- `DISCORD_GUILD_ID`: Optional, used for direct Discord links
- `PORT`: Optional, defaults to `3001`

### Permissions

The bot must be in the server and able to read the target channel history.

## Styles

Global styles now live in `src/styles/base.css`.

Feature styles are split into separate files and imported by their owning components:

- `src/styles/navbar.css`
- `src/styles/featured-edits.css`
- `src/styles/discord.css`

## Run Locally

```bash
npm install
npm run dev
```

## Production Preview

```bash
npm run build
npm run start
```

The backend serves both the built frontend and the Discord API endpoint.