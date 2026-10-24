import { useEffect } from 'react';
import { profile } from '../data/portfolio.js';
import { useFitText } from '../hooks/useFitText.js';
import { openTerminal } from './Terminal.jsx';

export default function Hero() {
  const nameRef = useFitText('.hero-line', 200);

  // Mouse parallax: the two name lines drift by different amounts, so the heading feels layered.
  useEffect(() => {
    const name = nameRef.current;
    if (!name || !window.matchMedia('(hover: hover)').matches) return undefined;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let frame = 0;
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.08;
      pos.y += (target.y - pos.y) * 0.08;
      name.style.setProperty('--px', pos.x.toFixed(3));
      name.style.setProperty('--py', pos.y.toFixed(3));
      frame = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (event) => {
      target.x = event.clientX / window.innerWidth - 0.5;
      target.y = event.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [nameRef]);

  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-chips reveal">
          <span className="chip">
            <span className="chip-dot" />
            {profile.currentPosition}
          </span>
          <span className="chip">📍 {profile.location}</span>
        </div>

        <h1 className="hero-name" ref={nameRef} aria-label={`${profile.name} ${profile.surname}`}>
          <SplitWord word={profile.name} />
          <SplitWord word={profile.surname} outline offset={profile.name.length} />
        </h1>

        <div className="hero-bottom">
          <div className="hero-intro reveal">
            <p className="hero-lead">
              A frontend developer who <em>sweats the details</em>. I build with React, Go, Rust and Docker,
              turning ideas into <em>fast, polished interfaces</em> people enjoy using.
            </p>
            <p className="hero-quote">“{profile.tagline}”</p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-fill">
                <span className="btn-sweep" />
                <span className="btn-label">View my work</span>
              </a>
              <a href="#contact" className="btn btn-ghost">Get in touch</a>
              <button type="button" className="hero-cv" onClick={openTerminal}>
                <span className="only-pointer">or press <kbd>`</kbd> for a terminal</span>
                <span className="only-touch">or open the terminal &gt;_</span>
              </button>
            </div>
          </div>

          <a href="#about" className="hero-scroll" aria-label="Scroll to about" data-cursor-label="↓">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path id="hero-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text>
                <textPath href="#hero-circle" textLength="286" lengthAdjust="spacing">
                  Scroll · Explore · Scroll · Explore ·
                </textPath>
              </text>
            </svg>
            <span>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function SplitWord({ word, outline = false, offset = 0 }) {
  return (
    <span className={`hero-line ${outline ? 'is-outline' : ''}`} aria-hidden="true">
      {[...word].map((letter, index) => (
        <span className="hero-letter" style={{ '--i': index + offset }} key={`${letter}-${index}`}>
          {letter}
        </span>
      ))}
    </span>
  );
}
