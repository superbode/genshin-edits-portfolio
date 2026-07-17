import kazuhaAvatar from '../assets/images/Kaedehara_Kazuha_Avatar.webp';
import { useState } from 'react';
import NavLink from './NavLink.tsx';
import '../styles/navbar.css';

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
                        <img src={kazuhaAvatar} alt="Kaedehara Kazuha Avatar" className="logo-icon" />
                    </div>
                    <div>
                        <h1 className="logo-text">kazuhas group</h1>
                        <p className="logo-subtitle">Genshin Edits</p>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="nav-links">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            label={link.name}
                            isActive={activePage === link.page}
                            className="nav-link"
                            onClick={() => onNavigate(link.page)}
                        />
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
                        <NavLink
                            key={link.name}
                            label={link.name}
                            isActive={activePage === link.page}
                            className="mobile-nav-link"
                            onClick={() => {
                                onNavigate(link.page);
                                setIsOpen(false);
                            }}
                        />
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;