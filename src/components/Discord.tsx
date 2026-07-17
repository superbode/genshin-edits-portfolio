import discordGroupIcon from '../assets/images/ka3d3hara-logo.png'
import DiscordHighlightCard from './DiscordHighlightCard.tsx'
import type { CommunityHighlight } from '../data/communityHighlights.ts'
import { communityHighlights } from '../data/communityHighlights.ts'
import '../styles/discord.css'

const discordInviteUrl = 'https://discord.gg/vkete7wdQR'

function Discord() {
    return (
        <section id="discord" className="page-section discord-page">
            <div className="discord-shell">
                <div className="discord-invite-card">
                    <div className="discord-invite-copy">
                        <h2>Join kazuhas group below!</h2>
                        <div className="discord-group-icon-frame">
                            <img
                                className="discord-group-icon"
                                src={discordGroupIcon}
                                alt="kazuhas group icon"
                            />
                        </div>
                    </div>

                    <a
                        className="discord-continue-button"
                        href={discordInviteUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Continue to Discord
                    </a>
                </div>

                <div className="discord-info-panel">
                    <header className="discord-info-header">
                        <p className="discord-eyebrow">Inside the server</p>
                        <h3>What you&apos;ll find there</h3>
                    </header>

                    <div className="discord-highlights-grid">
                        {communityHighlights.map((item: CommunityHighlight) => (
                            <DiscordHighlightCard key={item.title} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Discord
