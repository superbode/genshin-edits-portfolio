import { useMemo, useState } from 'react'
import Navbar, { type NavPage } from './components/Navbar.tsx'
import Home from './components/Home.tsx'
import FeaturedEdits from './components/FeaturedEdits.tsx'
import Discord from './components/Discord.tsx'

function App() {
  const [activePage, setActivePage] = useState<NavPage>('home')

  const currentPage = useMemo(() => {
    if (activePage === 'featured-edits') {
      return <FeaturedEdits />
    }

    if (activePage === 'discord') {
      return <Discord />
    }

    return <Home />
  }, [activePage])

  return (
    <div className="App">
      <Navbar activePage={activePage} onNavigate={setActivePage} />
      <main className="page-content">{currentPage}</main>
    </div>
  )
}

export default App
