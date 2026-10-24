import { useEffect, useState } from 'react';
import { profile } from '../data/portfolio.js';

const GREETINGS = ['สวัสดี', 'Hello', 'こんにちは', 'Hola', 'Bonjour', '안녕하세요', profile.name];
const DURATION = 2000;

// Shown on every page load; skipped only for people who ask for reduced motion.
function shouldSkip() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Preloader() {
  const [skip] = useState(shouldSkip);
  const [percent, setPercent] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(skip);

  useEffect(() => {
    if (skip) {
      document.documentElement.classList.add('is-ready');
      return undefined;
    }

    document.documentElement.classList.add('is-loading');
    const start = performance.now();
    let frame = 0;
    let timer = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      setPercent(Math.round(100 * (1 - Math.pow(1 - t, 3))));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      timer = window.setTimeout(() => {
        setLeaving(true);
        document.documentElement.classList.remove('is-loading');
        document.documentElement.classList.add('is-ready');
        timer = window.setTimeout(() => setGone(true), 900);
      }, 250);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [skip]);

  if (gone) return null;

  const greeting = GREETINGS[Math.min(GREETINGS.length - 1, Math.floor((percent / 100) * GREETINGS.length))];

  return (
    <div className={`preloader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <div className="preloader-row">
        <span className="eyebrow">{profile.name} {profile.surname} — Portfolio</span>
        <span className="eyebrow">©{new Date().getFullYear()}</span>
      </div>
      <div className="preloader-greeting" key={greeting}>
        <span className="preloader-dot" />
        {greeting}
      </div>
      <div className="preloader-row preloader-bottom">
        <div className="preloader-bar"><span style={{ width: `${percent}%` }} /></div>
        <span className="preloader-count">{String(percent).padStart(3, '0')}</span>
      </div>
    </div>
  );
}
