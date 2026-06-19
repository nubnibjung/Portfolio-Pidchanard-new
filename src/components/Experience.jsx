import { experiences } from '../data/portfolio.js';
import SectionHeader from './SectionHeader.jsx';

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHeader label="02. Experience" title="Work History" />
        <div className="timeline">
          {experiences.map((experience) => (
            <div className="timeline-item reveal" key={`${experience.title}-${experience.date}`}>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>{experience.title}</h3>
                  <span className="timeline-company">{experience.company}</span>
                </div>
                <span className="timeline-date">
                  {[experience.date, experience.type].filter(Boolean).join(' | ')}
                </span>
                <p>{experience.description}</p>
                {experience.highlights?.length > 0 && (
                  <ul className="timeline-highlights">
                    {experience.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}
                <div className="timeline-tags">
                  {experience.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
