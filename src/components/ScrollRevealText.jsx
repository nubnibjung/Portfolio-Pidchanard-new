import { useEffect, useRef } from 'react';

// Words start dim and light up one by one as the paragraph scrolls up through the screen.
// `highlight` words (exact match, punctuation ignored) light up in the accent colour.
export default function ScrollRevealText({ text, highlight = [], className = '' }) {
  const ref = useRef(null);
  const words = text.split(/\s+/);
  const accent = new Set(highlight.map((word) => word.toLowerCase()));

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const spans = [...element.querySelectorAll('.srt-word')];
    let frame = 0;
    let lit = -1;

    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      // Starts when the paragraph's top reaches 85% of the viewport, done when its bottom reaches 45%.
      const start = window.innerHeight * 0.85;
      const end = window.innerHeight * 0.45;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (rect.height + start - end)));
      const count = Math.round(progress * spans.length);
      if (count === lit) return;
      lit = count;
      spans.forEach((span, index) => span.classList.toggle('is-lit', index < count));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spans.forEach((span) => span.classList.add('is-lit'));
      return undefined;
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [text]);

  return (
    <p className={`srt ${className}`} ref={ref} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden="true"
          className={`srt-word ${accent.has(word.replace(/[^\w.+-]/g, '').toLowerCase()) ? 'is-accent' : ''}`}
        >
          {word}{index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
