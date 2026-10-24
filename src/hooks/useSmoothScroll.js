import Lenis from 'lenis';
import { useEffect } from 'react';

let lenis = null;

export function scrollToTarget(target) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;
  if (lenis) lenis.scrollTo(element, { duration: 1.6 });
  else element.scrollIntoView({ behavior: 'smooth' });
}

// Freeze page scrolling while an overlay (e.g. the terminal) is open.
export function setScrollLocked(locked) {
  document.documentElement.classList.toggle('scroll-locked', locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    lenis = new Lenis({ lerp: 0.09 });
    let frame = 0;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Route in-page anchor links through Lenis so they glide instead of jumping.
    const onClick = (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute('href');
      if (hash.length < 2) return;
      event.preventDefault();
      scrollToTarget(hash);
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('click', onClick);
      lenis.destroy();
      lenis = null;
    };
  }, []);
}
