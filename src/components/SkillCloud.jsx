import { useEffect, useRef } from 'react';

// A sphere of words that slowly spins, tilts toward the pointer and can be dragged.
export default function SkillCloud({ items, activeGroup = null }) {
  const containerRef = useRef(null);
  const wordRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = items.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const points = items.map((_, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      return { x: Math.cos(golden * i) * r, y, z: Math.sin(golden * i) * r };
    });

    let radius = 1;
    let halfWidth = 1;
    let wordWidths = [];
    const resize = () => {
      radius = Math.min(container.clientWidth, container.clientHeight) * 0.42;
      halfWidth = container.clientWidth / 2;
      wordWidths = wordRefs.current.map((el) => el?.offsetWidth ?? 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const state = { rotY: 0, rotX: -0.25, velY: 0.18, tiltTarget: -0.25, dragging: false, lastX: 0, lastY: 0 };

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      if (state.dragging) {
        const dx = event.clientX - state.lastX;
        const dy = event.clientY - state.lastY;
        state.velY = dx * 0.6;
        state.rotY += dx * 0.008;
        state.tiltTarget = Math.max(-1, Math.min(1, state.tiltTarget + dy * 0.006));
        state.lastX = event.clientX;
        state.lastY = event.clientY;
        return;
      }
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      state.tiltTarget = -0.25 + ny * 0.5;
    };
    const onPointerDown = (event) => {
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      container.setPointerCapture(event.pointerId);
    };
    const onPointerUp = () => { state.dragging = false; };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    let inView = true;
    const io = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; });
    io.observe(container);

    const render = () => {
      const cosY = Math.cos(state.rotY);
      const sinY = Math.sin(state.rotY);
      const cosX = Math.cos(state.rotX);
      const sinX = Math.sin(state.rotX);

      points.forEach((p, i) => {
        const el = wordRefs.current[i];
        if (!el) return;
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const depth = (z2 + 1) / 2; // 0 = back, 1 = front
        const scale = 0.55 + depth * 0.65;
        // Keep long words inside the box so they are never cut off at the edges.
        const limit = Math.max(0, halfWidth - (wordWidths[i] * scale) / 2);
        const x = Math.max(-limit, Math.min(limit, x1 * radius));
        el.style.transform = `translate3d(${x}px, ${y2 * radius}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(0.18 + depth * 0.82);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = depth < 0.35 ? `blur(${(0.35 - depth) * 4}px)` : 'none';
      });
    };

    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (inView) {
        if (!state.dragging) {
          // Ease drag momentum back to the idle spin.
          state.velY += (0.18 - state.velY) * (1 - Math.exp(-1.5 * dt));
          state.rotY += state.velY * dt;
        }
        state.rotX += (state.tiltTarget - state.rotX) * (1 - Math.exp(-3 * dt));
        render();
      }
      frame = requestAnimationFrame(tick);
    };

    render();
    if (!reduceMotion) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      io.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
    };
  }, [items]);

  return (
    <div
      className={`skill-cloud ${activeGroup ? 'has-active' : ''}`}
      ref={containerRef}
      data-cursor="drag"
      data-cursor-label="Drag"
      aria-hidden="true"
    >
      {items.map((item, index) => (
        <span
          key={item.name}
          ref={(el) => { wordRefs.current[index] = el; }}
          className={`skill-word ${item.featured ? 'is-featured' : ''} ${item.group === activeGroup ? 'is-active' : ''}`}
        >
          {item.name}
        </span>
      ))}
    </div>
  );
}
