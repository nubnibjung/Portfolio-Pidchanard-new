import { useEffect, useRef, useState } from 'react';

export function useCounterOnView(value) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(() => (parseNumber(value) ? formatLike(value, 0) : value));

  useEffect(() => {
    const parsed = parseNumber(value);
    if (!ref.current || !parsed) {
      setDisplayValue(value);
      return undefined;
    }

    const element = ref.current;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(element);

        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / 1400);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplayValue(formatLike(value, parsed.number * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return { ref, displayValue };
}

function parseNumber(value) {
  const match = /^(\d+(?:\.(\d+))?)(.*)$/.exec(value);
  if (!match) return null;
  return { number: Number(match[1]), decimals: match[2]?.length ?? 0, suffix: match[3] };
}

function formatLike(value, current) {
  const { decimals, suffix } = parseNumber(value);
  return `${current.toFixed(decimals)}${suffix}`;
}
