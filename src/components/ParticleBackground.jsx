import { useEffect, useRef, useState } from 'react';

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function ParticleBackground() {
  const containerRef = useRef(null);
  const [enabled] = useState(supportsWebGL);

  useEffect(() => {
    if (!enabled) return undefined;
    let dispose;
    let cancelled = false;

    // three.js is loaded lazily so the page content paints before the scene is ready.
    import('../webgl/ParticleScene.js').then(({ createParticleScene }) => {
      if (!cancelled) dispose = createParticleScene(containerRef.current);
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [enabled]);

  return (
    <div className="scene" aria-hidden="true">
      <div className="scene-glow" />
      {enabled && <div className="scene-canvas" ref={containerRef} />}
      <div className="scene-vignette" />
    </div>
  );
}
