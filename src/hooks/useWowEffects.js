import { useEffect } from 'react';
import { engageHyperdrive } from '../webgl/scrollState.js';

// Small global touches:
// - scroll speed is exposed as --skew on <html>, so headings and marquees lean while you scroll fast;
// - clicking empty space gives the particle background a short colour burst.
export function useWowEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const root = document.documentElement;
    let lastY = window.scrollY;
    let skew = 0;
    let frame = 0;

    const tick = () => {
      const y = window.scrollY;
      const target = Math.max(-8, Math.min(8, (y - lastY) * 0.35));
      lastY = y;
      skew += (target - skew) * 0.12;
      root.style.setProperty('--skew', `${skew.toFixed(2)}deg`);
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
      root.style.removeProperty('--skew');
    };
  }, []);
}
