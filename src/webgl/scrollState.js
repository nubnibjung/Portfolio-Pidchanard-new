// Shared, mutable scroll state read by the WebGL scene every frame (kept outside React to avoid re-renders).
export const scrollState = {
  // 0 → 6, one unit per "stage" section; fractional values blend between particle shapes.
  progress: 0,
  // performance.now() timestamp until which "hyperdrive" (fast, colour-cycling particles) is on.
  hyperUntil: 0,
};

export const HYPERDRIVE_EVENT = 'pm:hyperdrive';

export function engageHyperdrive(durationMs = 9000) {
  scrollState.hyperUntil = performance.now() + durationMs;
  window.dispatchEvent(new CustomEvent(HYPERDRIVE_EVENT));
}

// Sections that drive the particle morph, in order. Each one maps to a shape stage.
export const stageSections = ['hero', 'about', 'experience', 'skills', 'projects', 'achievements', 'contact'];

// Section tops are cached: measuring them every frame forces a layout on every frame.
// They are re-measured whenever the page's size changes.
let cachedTops = null;
let observer = null;

function measureTops() {
  const tops = [];
  for (const id of stageSections) {
    const element = document.getElementById(id);
    if (!element) return null;
    tops.push(element.getBoundingClientRect().top + window.scrollY);
  }
  return tops;
}

export function readStageProgress() {
  if (!observer && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => { cachedTops = null; });
    observer.observe(document.body);
    window.addEventListener('resize', () => { cachedTops = null; });
  }
  if (!cachedTops) cachedTops = measureTops();
  const tops = cachedTops;
  if (!tops) return scrollState.progress;
  const anchor = window.scrollY + window.innerHeight * 0.35;

  if (anchor <= tops[0]) return 0;

  for (let i = 0; i < tops.length - 1; i += 1) {
    if (anchor < tops[i + 1]) {
      const local = (anchor - tops[i]) / Math.max(1, tops[i + 1] - tops[i]);
      // Hold the current shape for the first part of a section, then morph toward the next one.
      return i + Math.min(1, Math.max(0, (local - 0.4) / 0.6));
    }
  }

  return tops.length - 1;
}
