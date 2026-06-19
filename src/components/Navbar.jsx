import { useEffect, useMemo, useState } from 'react';
import { navigationItems, profile } from '../data/portfolio.js';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { useScrolled } from '../hooks/useScrolled.js';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const sectionIds = useMemo(() => navigationItems.map((item) => item.href.replace('#', '')), []);
  const activeSection = useActiveSection(sectionIds);
  const isScrolled = useScrolled();
  const isDarkTheme = theme === 'dark';

  const closeMenu = () => setIsMenuOpen(false);
  const toggleTheme = () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className={`nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#hero" className="nav-logo" onClick={closeMenu}>
          {profile.initials}.
        </a>

        <div className="nav-desktop">
          <NavLinks activeSection={activeSection} />
          <ThemeToggle isDarkTheme={isDarkTheme} onClick={toggleTheme} />
        </div>

        <button
          className={`menu-btn ${isMenuOpen ? 'open' : ''}`}
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
        <NavLinks activeSection={activeSection} className="nav-mobile-links" onClick={closeMenu} />
        <ThemeToggle isDarkTheme={isDarkTheme} onClick={toggleTheme} />
      </div>
    </nav>
  );
}

function NavLinks({ activeSection, className = 'nav-links', onClick }) {
  return (
    <ul className={className}>
      {navigationItems.map((item) => {
        const isResumeLink = item.href === '#contact';
        const isActive = item.href === `#${activeSection}`;
        const linkClassName = [isActive ? 'active' : '', isResumeLink && className === 'nav-links' ? 'btn-nav' : '']
          .filter(Boolean)
          .join(' ');

        return (
          <li key={item.href}>
            <a
              href={isResumeLink ? profile.resumeUrl : item.href}
              className={linkClassName}
              download={isResumeLink ? profile.resumeFileName : undefined}
              onClick={onClick}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function ThemeToggle({ isDarkTheme, onClick }) {
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
      aria-pressed={!isDarkTheme}
      onClick={onClick}
    >
      <ThemeIcon isDarkTheme={isDarkTheme} />
      <span className="theme-toggle-text">{isDarkTheme ? 'Dark' : 'Light'}</span>
    </button>
  );
}

function ThemeIcon({ isDarkTheme }) {
  if (isDarkTheme) {
    return (
      <svg className="theme-toggle-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278Z" />
      </svg>
    );
  }

  return (
    <svg className="theme-toggle-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0Zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13Zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5ZM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8Zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0Zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0Zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707ZM4.464 4.464a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707Z" />
    </svg>
  );
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
