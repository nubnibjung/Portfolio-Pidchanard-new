import { useScrambleText } from '../hooks/useScrambleText.js';

export default function SectionHeader({ number, label, title }) {
  const { ref, display } = useScrambleText(title);

  return (
    <div className="section-header reveal">
      <div className="section-eyebrow">
        <span className="section-number">{number}</span>
        <span className="section-rule" />
        <span className="eyebrow">{label}</span>
      </div>
      {/* The real title (invisible) reserves the space; the scrambled copy is overlaid on top,
          so random glyph widths can never re-wrap the heading and shift the page. */}
      <h2 className="section-title scramble" ref={ref} aria-label={title}>
        <span className="scramble-ghost" aria-hidden="true">{title}</span>
        <span className="scramble-live" aria-hidden="true">{display}</span>
      </h2>
    </div>
  );
}
