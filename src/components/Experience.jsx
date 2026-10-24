import { Fragment, useEffect, useRef, useState } from 'react';
import { experiences } from '../data/portfolio.js';
import SectionHeader from './SectionHeader.jsx';

const COLLAPSED_COUNT = 2;

export default function Experience() {
  const listRef = useRef(null);
  const fillRef = useRef(null);

  // The timeline rail on the left fills up as the list scrolls past the middle of the screen.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const list = listRef.current;
      if (!list || !fillRef.current) return;
      const rect = list.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - rect.top) / rect.height));
      fillRef.current.style.transform = `scaleY(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHeader number="02" label="Experience" title="Where I've built" />

        <div className="xp-list" ref={listRef}>
          <div className="xp-rail" aria-hidden="true">
            <span className="xp-rail-fill" ref={fillRef} />
          </div>
          {experiences.map((job) => (
            <ExperienceRow key={`${job.company}-${job.date}`} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceRow({ job }) {
  const [expanded, setExpanded] = useState(false);
  const highlights = job.highlights ?? [];
  const canCollapse = highlights.length > COLLAPSED_COUNT;
  const visible = expanded || !canCollapse ? highlights : highlights.slice(0, COLLAPSED_COUNT);
  const CompanyName = job.companyUrl ? 'a' : 'span';

  return (
    <article className="xp-row reveal">
      <span className="xp-dot" aria-hidden="true" />

      <div className="xp-side">
        <div className="xp-company">
          <span className="xp-logo" style={{ '--logo': job.color ?? 'var(--accent)' }}>
            {job.logo ? <img src={job.logo} alt="" style={{ objectFit: job.logoFit ?? 'contain' }} /> : job.company.slice(0, 2)}
          </span>
          <div>
            <CompanyName
              className="xp-company-name"
              {...(job.companyUrl ? { href: job.companyUrl, target: '_blank', rel: 'noreferrer' } : {})}
            >
              {job.company}{job.companyUrl && <span aria-hidden="true"> ↗</span>}
            </CompanyName>
            <span className="xp-date">{job.date}</span>
          </div>
        </div>
        <div className="tag-row">
          {job.type && <span className={`chip chip-sm ${job.current ? 'is-live' : ''}`}>{job.type}</span>}
          {job.location && <span className="chip chip-sm">{job.location}</span>}
        </div>
      </div>

      <div className="xp-card">
        <h3 className="xp-title">{job.title}</h3>
        {job.legalName && <p className="xp-legal">{job.legalName}</p>}
        {job.description && !highlights.length && <p className="xp-desc">{job.description}</p>}

        {highlights.length > 0 && (
          <ul className="xp-points">
            {visible.map((point) => (
              <li key={point}><Emphasis text={point} /></li>
            ))}
          </ul>
        )}

        {canCollapse && (
          <button type="button" className="xp-toggle" onClick={() => setExpanded((value) => !value)}>
            {expanded ? '− show less' : `+ show ${highlights.length - COLLAPSED_COUNT} more`}
          </button>
        )}

        <div className="tag-row xp-tags">
          {job.tags.map((tag) => (
            <span className="chip chip-sm" key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

// Renders **text** segments in the accent colour.
function Emphasis({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => (
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index} className="xp-em">{part.slice(2, -2)}</strong>
      : <Fragment key={index}>{part}</Fragment>
  ));
}
