import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="container header__content">
                <div className="header__logo">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="header__logo-icon">
                        <rect width="32" height="32" rx="8" fill="url(#paint0_linear)" />
                        <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24C20.4183 24 24 20.4183 24 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M22 10L16 16L22 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                            <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4F46E5" />
                                <stop offset="1" stopColor="#7C3AED" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="header__logo-text">TinyLink</span>
                </div>
                <nav className="header__nav">
                    {/* Add nav items here if needed */}
                </nav>
            </div>
        </header>
    );
};

export default Header;
