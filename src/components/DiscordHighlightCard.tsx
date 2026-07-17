type DiscordHighlightItem = {
    title: string
    description: string
}

type DiscordHighlightCardProps = {
    item: DiscordHighlightItem
}

function DiscordHighlightCard({ item }: DiscordHighlightCardProps) {
    return (
        <article className="discord-highlight-card">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
        </article>
    )
}

export type { DiscordHighlightItem }
export default DiscordHighlightCard
