import { useLayoutEffect, useRef } from 'react';

const PROBE_SIZE = 100;

// Sizes `ref`'s font so its widest `selector` child exactly fills the element's width (never clipped).
// Children must size to their content (inline-block / width: max-content) so they can be measured.
export function useFitText(selector, maxPx = 200) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const fit = () => {
      element.style.fontSize = `${PROBE_SIZE}px`;
      const widest = Math.max(...[...element.querySelectorAll(selector)].map((child) => child.getBoundingClientRect().width));
      const available = element.clientWidth;
      if (!widest || !available) return;
      element.style.fontSize = `${Math.min(maxPx, (PROBE_SIZE * available * 0.98) / widest)}px`;
    };

    fit();
    // Re-fit once the display font has loaded, and whenever the container resizes.
    document.fonts?.ready.then(fit);
    let lastWidth = element.clientWidth;
    const observer = new ResizeObserver(() => {
      // Font changes alter the height only; refit on width changes to avoid a resize feedback loop.
      if (element.clientWidth === lastWidth) return;
      lastWidth = element.clientWidth;
      fit();
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, [selector, maxPx]);

  return ref;
}
