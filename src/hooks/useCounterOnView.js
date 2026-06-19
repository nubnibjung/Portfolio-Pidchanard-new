import { useEffect, useRef, useState } from 'react';

export function useCounterOnView(value) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!ref.current || !Number.parseInt(value, 10)) {
      return undefined;
    }

    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter(value, setDisplayValue);
        observer.unobserve(element);
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value]);

  return { ref, displayValue };
}

function animateCounter(value, setDisplayValue) {
  let current = 0;
  const target = Number.parseInt(value, 10);
  const suffix = value.replace(/[0-9]/g, '');
  const duration = 1200;
  const step = 16;
  const increment = target / (duration / step);

  const timer = window.setInterval(() => {
    current = Math.min(current + increment, target);
    setDisplayValue(`${Math.floor(current)}${suffix}`);

    if (current >= target) {
      window.clearInterval(timer);
    }
  }, step);
}
