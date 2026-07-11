import { useEffect, useState } from 'react'

type FeaturedEditItem = {
  id: string
  title: string
  videoUrl: string
  thumbnailUrl?: string
  messageUrl?: string
}

function FeaturedEditCard({ edit }: { edit: FeaturedEditItem }) {
  return (
    <article className="featured-edit-card">
      <video
        className="featured-edit-video"
        controls
        preload="metadata"
        poster={edit.thumbnailUrl}
      >
        <source src={edit.videoUrl} />
        Your browser does not support the video tag.
      </video>

      <div className="featured-edit-meta">
        <h3>{edit.title}</h3>
        {edit.messageUrl ? (
          <a href={edit.messageUrl} target="_blank" rel="noreferrer">
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
      <h2>Featured Edits</h2>

      {loading ? <p>Loading featured edits...</p> : null}
      {error ? <p>{error}</p> : null}
      {!loading && !error && edits.length === 0 ? <p>No featured edits found.</p> : null}

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
