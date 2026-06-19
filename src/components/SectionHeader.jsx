export default function SectionHeader({ label, title }) {
  return (
    <div className="section-header reveal">
      <span className="section-label">{label}</span>
      <h2>{title}</h2>
    </div>
  );
}
