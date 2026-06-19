import { education } from '../data/portfolio.js';
import SectionHeader from './SectionHeader.jsx';

export default function Education() {
  return (
    <section className="section section-alt" id="education">
      <div className="container">
        <SectionHeader label="03. Education" title="Education" />
        <div className="timeline">
          <div className="timeline-item reveal">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-header">
                <h3>{education.degree}</h3>
                <span className="timeline-company">{education.school}</span>
              </div>
              <span className="timeline-date">{education.period}</span>
              <p>{education.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
