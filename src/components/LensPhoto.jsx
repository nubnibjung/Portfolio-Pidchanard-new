import { useEffect, useRef, useState } from 'react';

export default function LensPhoto({ src, alt }) {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let dispose;
    let cancelled = false;

    import('../webgl/LiquidLens.js').then(({ createLiquidLens }) => {
      if (cancelled) return;
      try {
        dispose = createLiquidLens(containerRef.current, src, () => setReady(true));
      } catch {
        // No WebGL: the plain <img> stays visible.
      }
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [src]);

  return (
    <div className={`lens-photo ${ready ? 'is-ready' : ''}`} ref={containerRef} data-cursor="lens">
      <img src={src} alt={alt} />
    </div>
  );
}
