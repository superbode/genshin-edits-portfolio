import { useEffect, useState } from 'react'
import '../styles/featured-edits.css'

type FeaturedEditItem = {
  id: string
  title: string
  videoUrl: string
  thumbnailUrl?: string
  messageUrl?: string
}

function formatFeaturedTitle(title: string) {
  const extensionRemoved = title.replace(/\.[^./\\\s]+$/, '')
  const separatorsNormalized = extensionRemoved.replace(/[_-]+/g, ' ')
  const trailingFormatTagRemoved = separatorsNormalized.replace(
    /\s+(mp4|mov|m4v|avi|mkv|webm|wmv|flv)$/i,
    ''
  )

  return trailingFormatTagRemoved.replace(/\s{2,}/g, ' ').trim()
}

function FeaturedEditCard({ edit }: { edit: FeaturedEditItem }) {
  const displayTitle = formatFeaturedTitle(edit.title)

  return (
    <article className="featured-edit-card">
      <div className="featured-edit-video-wrap">
        <video
          className="featured-edit-video"
          controls
          preload="metadata"
          poster={edit.thumbnailUrl}
        >
          <source src={edit.videoUrl} />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="featured-edit-meta">
        <h3>{displayTitle || edit.title}</h3>
        {edit.messageUrl ? (
          <a
            className="featured-edit-discord-link"
            href={edit.messageUrl}
            target="_blank"
            rel="noreferrer"
          >
            View on Discord
          </a>
        ) : null}
      </div>
    </article>
  )
}

function FeaturedEdits() {
  const [edits, setEdits] = useState<FeaturedEditItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadFeaturedEdits() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/discord/featured-edits')

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = (await response.json()) as FeaturedEditItem[]

        if (!ignore) {
          setEdits(data)
        }
      } catch (requestError) {
        if (!ignore) {
          setError('Unable to load featured edits right now.')
        }

        console.error(requestError)
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadFeaturedEdits()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section id="featured-edits" className="page-section featured-edits-page">
      <header className="featured-edits-header">
        <h2>Featured Edits</h2>
        <p>Recent edits from kazuhas group.</p>
      </header>

      {loading ? <p className="featured-edits-status">Loading featured edits...</p> : null}
      {error ? <p className="featured-edits-status featured-edits-status-error">{error}</p> : null}
      {!loading && !error && edits.length === 0 ? (
        <p className="featured-edits-status">No featured edits found.</p>
      ) : null}

      {!loading && !error && edits.length > 0 ? (
        <div className="featured-edits-grid">
          {edits.map((edit) => (
            <FeaturedEditCard key={edit.id} edit={edit} />
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default FeaturedEdits
