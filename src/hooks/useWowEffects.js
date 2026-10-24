import { useEffect } from 'react';
import { engageHyperdrive } from '../webgl/scrollState.js';

// Small global touches:
// - scroll speed is exposed as --skew on <html>, so headings and marquees lean while you scroll fast;
// - clicking empty space gives the particle background a short colour burst.
export function useWowEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let lastY = window.scrollY;
    let skew = 0;
    let written = '';
    let frame = 0;

    // Set --skew only on the elements that lean (not on <html>, which would restyle the whole
    // page every frame), and only when the value actually changes.
    const leaners = () => document.querySelectorAll('.marquee-wrap, .section-title');
    const tick = () => {
      const y = window.scrollY;
      const target = Math.max(-8, Math.min(8, (y - lastY) * 0.35));
      lastY = y;
      skew += (target - skew) * 0.12;
      if (Math.abs(skew) < 0.01) skew = 0;
      const value = `${skew.toFixed(2)}deg`;
      if (value !== written) {
        written = value;
        leaners().forEach((el) => el.style.setProperty('--skew', value));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onClick = (event) => {
      if (event.target.closest('a, button, input, textarea, [data-cursor], .terminal-overlay, .pcard')) return;
      engageHyperdrive(1400);
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('click', onClick);
      leaners().forEach((el) => el.style.removeProperty('--skew'));
    };
  }, []);
}
