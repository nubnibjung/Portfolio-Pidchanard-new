import { profile, stats } from '../data/portfolio.js';
import { useCounterOnView } from '../hooks/useCounterOnView.js';
import SectionHeader from './SectionHeader.jsx';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHeader label="01. About Me" title="Who I Am" />
        <div className="about-grid">
          <div className="about-text reveal">
            <p>{profile.summary}</p>
            <p>
              Based in <strong>{profile.location}</strong>, I focus on building scalable,
              user-centric applications across web and mobile platforms.
            </p>
            <a href={profile.resumeUrl} className="btn btn-primary" download={profile.resumeFileName}>Download CV</a>
          </div>

          <div className="about-stats reveal">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }) {
  const { ref, displayValue } = useCounterOnView(value);

  return (
    <div className="stat-card" ref={ref}>
      <span className="stat-number">{displayValue}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
