import { skills } from '../data/portfolio.js';
import SectionHeader from './SectionHeader.jsx';

export default function Skills() {
  return (
    <section className="section section-alt" id="skills">
      <div className="container">
        <SectionHeader label="04. Skills" title="Tech Stack" />
        <div className="skills-grid">
          {skills.map((group) => (
            <div className="skill-group reveal" key={group.title}>
              <h3 className="skill-group-title">{group.title}</h3>
              <div className="skill-tags">
                {group.items.map((item) => (
                  <span className="skill-tag" key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
