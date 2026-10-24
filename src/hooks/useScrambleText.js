import { useEffect, useRef, useState } from 'react';

// Mostly medium-width glyphs so the scrambled line stays close to the real width.
const GLYPHS = 'ABCDEGHKNOPRSUVXYZ0123456789#=+?';
const DURATION = 1500;
// Glyphs change every few frames instead of every frame, so the scramble reads calmer.
const GLYPH_INTERVAL = 60;

// Returns text that scrambles into `text` each time the element scrolls into view
// (both scrolling down and back up). Letters settle left to right.
export function useScrambleText(text) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return undefined;
    }

    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      const start = performance.now();
      let lastSwap = -Infinity;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / DURATION);
        if (t < 1 && now - lastSwap < GLYPH_INTERVAL) {
          frame = requestAnimationFrame(tick);
          return;
        }
        lastSwap = now;
        const settled = Math.floor(t * text.length);
        let out = '';
        for (let i = 0; i < text.length; i += 1) {
          const char = text[i];
          out += i < settled || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setDisplay(out);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) run();
    }, { threshold: 0.6 });
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [text]);

  return { ref, display };
}
