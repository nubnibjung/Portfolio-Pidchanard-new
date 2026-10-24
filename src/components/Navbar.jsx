import { useEffect, useMemo, useRef, useState } from 'react';
import { navigationItems, profile } from '../data/portfolio.js';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { openTerminal } from './Terminal.jsx';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const sectionIds = useMemo(() => navigationItems.map((item) => item.href.slice(1)), []);
  const activeSection = useActiveSection(sectionIds);
  const progressRef = useRef(null);
  const time = useBangkokTime();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setIsHidden(y > 200 && y > lastY);
      lastY = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty('transform', `scaleX(${max > 0 ? y / max : 0})`);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', isMenuOpen);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <div className="scroll-progress" ref={progressRef} />
      <header className={`nav ${isHidden && !isMenuOpen ? 'is-hidden' : ''}`}>
        <div className="container nav-inner">
          <a href="#hero" className="nav-brand" aria-label="Home" onClick={closeMenu}>
            <span className="nav-badge">
              <span className="nav-badge-text">{profile.initials}</span>
              <span className="nav-badge-alt">:)</span>
            </span>
            <span className="nav-brand-text">
              <span>{profile.name} {profile.surname}</span>
              <span className="nav-brand-role">{profile.role}</span>
            </span>
          </a>

          <nav className="nav-pill glass" aria-label="Sections">
            {navigationItems.map((item) => (
              <a key={item.href} href={item.href} className={activeSection === item.href.slice(1) ? 'is-active' : ''}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <span className="nav-clock">
              <span className="live-dot" />
              BKK {time}
            </span>
            <button type="button" className="nav-terminal glass" onClick={openTerminal} aria-label="Open terminal" data-cursor-label=">_">
              <span>&gt;_</span>
              <kbd>⌘K</kbd>
            </button>
            <a href={profile.resumeUrl} download={profile.resumeFileName} className="nav-resume glass" data-cursor-label="CV">
              Resume ↓
            </a>
            <button
              className={`nav-menu-btn glass ${isMenuOpen ? 'is-open' : ''}`}
              type="button"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${isMenuOpen ? 'is-open' : ''}`} aria-hidden={!isMenuOpen}>
        <ul>
          {navigationItems.map((item, index) => (
            <li key={item.href} style={{ transitionDelay: isMenuOpen ? `${0.15 + index * 0.05}s` : '0s' }}>
              <a href={item.href} onClick={closeMenu} tabIndex={isMenuOpen ? 0 : -1}>
                <span>0{index + 1}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-menu-links">
          <a href={profile.githubUrl} target="_blank" rel="noreferrer" tabIndex={isMenuOpen ? 0 : -1}>GitHub ↗</a>
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" tabIndex={isMenuOpen ? 0 : -1}>LinkedIn ↗</a>
          <a href={profile.resumeUrl} download={profile.resumeFileName} tabIndex={isMenuOpen ? 0 : -1}>Resume ↓</a>
        </div>
      </div>
    </>
  );
}

function useBangkokTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const format = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const update = () => setTime(format.format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
}
