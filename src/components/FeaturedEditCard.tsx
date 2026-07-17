export type FeaturedEditItem = {
    id: string
    title: string
    videoUrl: string
    author?: string
    discordHandle?: string
    thumbnailUrl?: string
    messageUrl?: string
}
import '../styles/featured-edit-card.css'

function formatFeaturedTitle(title: string) {
    const extensionRemoved = title.replace(/\.[^./\\\s]+$/, '')
    const separatorsNormalized = extensionRemoved.replace(/[_-]+/g, ' ')
    const trailingFormatTagRemoved = separatorsNormalized.replace(
        /\s+(mp4|mov|m4v|avi|mkv|webm|wmv|flv)$/i,
        ''
    )

    return trailingFormatTagRemoved.replace(/\s{2,}/g, ' ').trim()
}

type FeaturedEditCardProps = {
    edit: FeaturedEditItem
}

function FeaturedEditCard({ edit }: FeaturedEditCardProps) {
    const displayTitle = formatFeaturedTitle(edit.title)
    const hasAuthor = Boolean(edit.author?.trim())
    const hasDiscord = Boolean(edit.discordHandle?.trim())

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
                {hasAuthor || hasDiscord ? (
                    <p className="featured-edit-inline-meta">
                        {hasAuthor ? <span>Author: {edit.author?.trim()}</span> : null}
                        {hasDiscord ? <span>Discord: {edit.discordHandle?.trim()}</span> : null}
                    </p>
                ) : null}
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

export default FeaturedEditCard