import { useEffect, useRef, useState } from 'react';

const RING_SIZES = { default: 36, read: 88, link: 64, lens: 120, text: 4, drag: 84, view: 96 };
// Over plain text the ring grows and tints whatever text sits inside it.
const READABLE = 'p, h1, h2, h3, li, pre, .hero-line, .contact-title-line, .skill-word, .marquee-item, .eyebrow, .stat-number';
const TINT_MODES = new Set(['default', 'read']);

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const tintRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState('default');
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    let visible = false;
    let frame = 0;

    const setOpacity = (value) => {
      dotRef.current?.style.setProperty('opacity', value);
      ringRef.current?.style.setProperty('opacity', value);
      tintRef.current?.style.setProperty('opacity', value);
    };

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        visible = true;
        ring.x = target.x;
        ring.y = target.y;
        setOpacity('1');
      }

      const hit = event.target.closest?.('[data-cursor], a, button, input, textarea');
      if (!hit) {
        setMode(event.target.closest?.(READABLE) ? 'read' : 'default');
        setLabel('');
        return;
      }
      setMode(hit.dataset.cursor ?? (hit.matches('input, textarea') ? 'text' : 'link'));
      setLabel(hit.dataset.cursorLabel ?? '');
    };

    const onLeave = () => {
      visible = false;
      setOpacity('0');
    };

    const tick = () => {
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      if (tintRef.current) tintRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  if (!enabled) return null;

  const size = RING_SIZES[mode] ?? RING_SIZES.default;

  const tint = TINT_MODES.has(mode);

  return (
    <>
      {/* Separate layer: multiply turns light text inside the circle into the theme colour, dark areas stay dark. */}
      <div ref={tintRef} className="cursor-tint" aria-hidden="true">
        <span style={{ width: tint ? size : 0, height: tint ? size : 0 }} />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true">
        <span className={mode === 'text' ? 'is-text' : ''} />
      </div>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span className={`is-${mode}`} style={{ width: size, height: size }}>{label}</span>
      </div>
    </>
  );
}
