import { useEffect, useMemo, useState } from 'react'
import type { NavPage } from './Navbar.tsx'
import '../styles/home.css'

type HomeProps = {
  onNavigate: (page: NavPage) => void
}

type GuildStatsResponse = {
  memberCount: number
  onlineCount: number
}

function Home({ onNavigate }: HomeProps) {
  const [guildStats, setGuildStats] = useState<GuildStatsResponse | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadGuildStats() {
      try {
        const response = await fetch('/api/discord/guild-stats')

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = (await response.json()) as GuildStatsResponse

        if (!ignore) {
          setGuildStats(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (!ignore) {
          setStatsLoading(false)
        }
      }
    }

    loadGuildStats()

    return () => {
      ignore = true
    }
  }, [])

  const memberCountLabel = useMemo(() => {
    if (statsLoading) {
      return 'Loading members...'
    }

    if (!guildStats?.memberCount) {
      return 'Member count unavailable right now'
    }

    return `${guildStats.memberCount.toLocaleString()} members in the server`
  }, [guildStats?.memberCount, statsLoading])

  return (
    <section id="home" className="page-section home-page">
      <header className="home-hero">
        <p className="home-eyebrow">Elegant, cinematic, and community-driven</p>
        <h2>Build edits you're proud of alongside people who genuinely care.</h2>
        <p className="home-intro">
          kazuhas group is a friendly community dedicated to the craft of video editing. If you want to improve your own edits, get constructive feedback, or help others, you will find a supportive space here filled with fellow passionate editors!
        </p>

        <hr className="home-divider" aria-hidden="true" />

        <div className="home-proof-strip" role="status" aria-live="polite">
          <span className="home-proof-value">{memberCountLabel}</span>
          {guildStats?.onlineCount ? (
            <span className="home-proof-online">
              {guildStats.onlineCount.toLocaleString()} currently online
            </span>
          ) : null}
        </div>
      </header>

      <section className="home-actions" aria-label="Primary actions">
        <article className="home-action-card">
          <h3>Join The Community</h3>
          <p>Meet fellow editors, ask questions, and find your place inside the server!</p>
          <button type="button" className="home-action-btn" onClick={() => onNavigate('discord')}>
            Enter Discord ❯
          </button>
        </article>

        <article className="home-action-card">
          <h3>Learn How To Apply</h3>
          <p>See how to apply to become a member in our community!</p>
          <button type="button" className="home-action-btn" onClick={() => onNavigate('discord')}>
            See Application Path ❯
          </button>
        </article>

        <article className="home-action-card">
          <h3>Watch Featured Edits</h3>
          <p>See standout edits from leads and members in the community!</p>
          <button
            type="button"
            className="home-action-btn"
            onClick={() => onNavigate('featured-edits')}
          >
            View Featured Edits ❯
          </button>
        </article>
      </section>

    </section>
  )
}

export default Home
