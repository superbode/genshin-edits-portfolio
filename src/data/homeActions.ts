import type { NavPage } from '../components/Navbar.tsx'

export type HomeActionItem = {
    title: string
    description: string
    buttonText: string
    destination: NavPage
}

export const homeActions: HomeActionItem[] = [
    {
        title: 'Join The Community',
        description: 'Meet fellow editors, ask questions, and find your place inside the server!',
        buttonText: 'Enter Discord ❯',
        destination: 'discord',
    },
    {
        title: 'Learn How To Apply',
        description: 'See how to apply to become a member in our community!',
        buttonText: 'See Application Path ❯',
        destination: 'discord',
    },
    {
        title: 'Watch Featured Edits',
        description: 'See standout edits from leads and members in the community!',
        buttonText: 'View Featured Edits ❯',
        destination: 'featured-edits',
    },
]