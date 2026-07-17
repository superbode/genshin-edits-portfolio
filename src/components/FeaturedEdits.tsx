import { useEffect, useState } from 'react'
import FeaturedEditCard, { type FeaturedEditItem } from './FeaturedEditCard.tsx'
import '../styles/featured-edits.css'

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
