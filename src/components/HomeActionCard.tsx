type HomeActionCardProps = {
    title: string
    description: string
    buttonText: string
    onClick: () => void
}
import '../styles/home-action-card.css'

function HomeActionCard({ title, description, buttonText, onClick }: HomeActionCardProps) {
    return (
        <article className="home-action-card">
            <h3>{title}</h3>
            <p>{description}</p>
            <button type="button" className="home-action-btn" onClick={onClick}>
                {buttonText}
            </button>
        </article>
    )
}

export default HomeActionCard