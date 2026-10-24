import { achievements } from '../data/portfolio.js';
import SectionHeader from './SectionHeader.jsx';

export default function Achievements() {
  return (
    <section className="section" id="achievements">
      <div className="container">
        <SectionHeader number="05" label="Competitions & learning" title="Milestones" />
        <div className="award-list">
          {achievements.map((achievement) => (
            <article className="award-item reveal" key={achievement.title}>
              <span className="award-date">{achievement.date}</span>
              <div className="award-main">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
              </div>
              <span className="award-location">{achievement.location}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
