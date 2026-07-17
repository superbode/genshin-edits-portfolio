export type FeaturedEditItem = {
    id: string
    title: string
    videoUrl: string
    author?: string
    discordHandle?: string
    tiktokHandle?: string
    instagramHandle?: string
    thumbnailUrl?: string
    messageUrl?: string
}
import { FaDiscord, FaInstagram, FaTiktok } from 'react-icons/fa6'
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
    const author = edit.author?.trim() || ''
    const discordHandle = edit.discordHandle?.trim() || ''
    const tiktokHandle = edit.tiktokHandle?.trim() || ''
    const instagramHandle = edit.instagramHandle?.trim() || ''
    const hasSocials = Boolean(discordHandle || tiktokHandle || instagramHandle)

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
                <h3>
                    {displayTitle || edit.title}
                    {author ? <span className="featured-edit-byline"> by {author}</span> : null}
                </h3>
                {hasSocials ? (
                    <p className="featured-edit-inline-meta" aria-label="Social media handles">
                        {discordHandle ? (
                            <span className="featured-edit-social-item">
                                <FaDiscord aria-hidden="true" />
                                <span>{discordHandle}</span>
                            </span>
                        ) : null}
                        {tiktokHandle ? (
                            <span className="featured-edit-social-item">
                                <FaTiktok aria-hidden="true" />
                                <span>{tiktokHandle}</span>
                            </span>
                        ) : null}
                        {instagramHandle ? (
                            <span className="featured-edit-social-item">
                                <FaInstagram aria-hidden="true" />
                                <span>{instagramHandle}</span>
                            </span>
                        ) : null}
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