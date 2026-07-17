import discordGroupIcon from '../assets/images/ka3d3hara-logo.png'
import '../styles/discord.css'

const discordInviteUrl = 'https://discord.gg/vkete7wdQR'

const communityHighlights = [
    {
        title: 'Applications',
        description: 'Learn how to apply and become a member in kazuhas group!',
    },
    {
        title: 'General Community',
        description: 'Chat in open channels, share your edits, and get helpful feedback from others!',
    },
    {
        title: 'Members Section',
        description: 'As a member, connect with members, join exclusive events, and collaborate more closely!',
    },
    {
        title: 'Bots',
        description: 'Use fun bots and interactive tools in the server!',
    },
]

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
                        {communityHighlights.map((item) => (
                            <article key={item.title} className="discord-highlight-card">
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Discord
