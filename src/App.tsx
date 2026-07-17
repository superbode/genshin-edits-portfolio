import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar, { type NavPage } from './components/Navbar.tsx'
import Home from './components/Home.tsx'
import FeaturedEdits from './components/FeaturedEdits.tsx'
import Discord from './components/Discord.tsx'

function App() {
    const [activePage, setActivePage] = useState<NavPage>('home')

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [activePage])

    const handleNavigate = useCallback((page: NavPage) => {
        setActivePage(page)
    }, [])

    const currentPage = useMemo(() => {
        if (activePage === 'featured-edits') {
            return <FeaturedEdits />
        }

        if (activePage === 'discord') {
            return <Discord />
        }

        return <Home onNavigate={handleNavigate} />
    }, [activePage, handleNavigate])

    return (
        <div className="App">
            <Navbar activePage={activePage} onNavigate={handleNavigate} />
            <main className="page-content">{currentPage}</main>
        </div>
    )
}

export default App
