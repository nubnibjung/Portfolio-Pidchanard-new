import { achievements } from '../data/portfolio.js';
import SectionHeader from './SectionHeader.jsx';

export default function Achievements() {
  return (
    <section className="section" id="achievements">
      <div className="container">
        <SectionHeader label="06. Achievements" title="Achievements" />
        <div className="achievement-grid">
          {achievements.map((achievement) => (
            <article className="achievement-card reveal" key={achievement.title}>
              <div className="achievement-meta">
                <span>{achievement.date}</span>
                <span>{achievement.location}</span>
              </div>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
