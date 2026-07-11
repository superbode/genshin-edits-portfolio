import ka3d3haraLogo from '../assets/images/ka3d3hara-logo.png';
import { useState } from 'react';

export type NavPage = 'home' | 'featured-edits' | 'discord';

interface NavbarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
}

const Navbar = ({ activePage, onNavigate }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', page: 'home' as const },
    { name: 'Featured Edits', page: 'featured-edits' as const },
    { name: 'Discord', page: 'discord' as const },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <div className="logo-icon">
            <img src={ka3d3haraLogo} alt="Ka3d3hara Logo" className="logo-icon" />
          </div>
          <div>
            <h1 className="logo-text">kazuhas group</h1>
            <p className="logo-subtitle">Genshin Edits</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <button
              key={link.name}
              className={`nav-link ${activePage === link.page ? 'active' : ''}`}
              type="button"
              onClick={() => onNavigate(link.page)}
              aria-current={activePage === link.page ? 'page' : undefined}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <button
              key={link.name}
              className={`mobile-nav-link ${activePage === link.page ? 'active' : ''}`}
              type="button"
              onClick={() => {
                onNavigate(link.page);
                setIsOpen(false);
              }}
              aria-current={activePage === link.page ? 'page' : undefined}
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;