import { education, profile, stats } from '../data/portfolio.js';
import { useCounterOnView } from '../hooks/useCounterOnView.js';
import LensPhoto from './LensPhoto.jsx';
import ScrollRevealText from './ScrollRevealText.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHeader number="01" label="About me" title="Hello, World" />

        <div className="about-grid">
          <div className="about-photo reveal">
            <LensPhoto src={profile.photoUrl} alt={`${profile.name} ${profile.surname}`} />
            <div className="about-photo-badge glass">
              <p className="eyebrow">Hover the photo</p>
              <p className="about-photo-note">GLSL liquid lens ✦</p>
            </div>
          </div>

          <div className="about-body">
            <ScrollRevealText
              className="about-statement"
              text="Information Technology graduate from Kasetsart University, now a Frontend Developer at Lodash Thailand. These days I build with React, Go, Rust and Docker, from polishing the last pixel of the UI to the services behind it, and I care about building things that feel good to use on every screen."
              highlight={['Frontend', 'Developer']}
            />

            <div className="about-columns reveal">
              <p>I build web apps with Angular and Tailwind, Android apps with Kotlin, and backends with .NET.</p>
              <p>A year interning in an Agile team taught me to ship features, fix tricky bugs and move legacy screens to Micro Frontend.</p>
            </div>

            <div className="stat-grid reveal">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="edu-card glass reveal">
              <span className="edu-logo">
                <img src="/kasetsart.webp" alt="Kasetsart University logo" />
              </span>
              <span className="edu-text">
                <span className="eyebrow">Education</span>
                <span className="edu-school">{education.school}</span>
                <span className="edu-degree">{education.degree}</span>
                <span className="edu-note">{education.description}</span>
              </span>
              <span className="edu-period">{education.period}</span>
            </div>
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
