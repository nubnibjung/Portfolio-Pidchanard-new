import { useEffect, useRef } from 'react';
import { projects } from '../data/portfolio.js';
import SectionHeader from './SectionHeader.jsx';

const DESKTOP = '(min-width: 1024px)';

export default function Projects() {
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);

  // Desktop: the section is pinned and vertical scroll slides the cards sideways.
  // Mobile: a plain swipeable row with scroll-snap.
  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    const media = window.matchMedia(DESKTOP);
    let distance = 0;
    let frame = 0;

    const measure = () => {
      if (!media.matches) {
        pin.style.height = '';
        track.style.transform = '';
        return;
      }
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      pin.style.height = `${window.innerHeight + distance}px`;
      update();
    };

    const setBar = (progress) => barRef.current?.style.setProperty('transform', `scaleX(${progress})`);

    const update = () => {
      frame = 0;
      if (!media.matches) {
        // Mobile: the bar follows the swipeable row instead.
        const max = track.scrollWidth - track.clientWidth;
        setBar(max > 0 ? track.scrollLeft / max : 0);
        return;
      }
      const progress = Math.min(1, Math.max(0, -pin.getBoundingClientRect().top / Math.max(1, distance)));
      track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      setBar(progress);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    track.addEventListener('scroll', onScroll, { passive: true });

    measure();
    document.fonts?.ready.then(measure);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    media.addEventListener('change', measure);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      track.removeEventListener('scroll', onScroll);
      media.removeEventListener('change', measure);
    };
  }, []);

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <SectionHeader number="04" label="Selected projects" title="Things I've built" />
      </div>

      <div className="projects-pin" ref={pinRef}>
        <div className="projects-sticky">
          <div className="projects-track" ref={trackRef}>
            <div className="projects-intro">
              <p>
                From coursework to side projects: video editing, online shops and booking systems,
                each built end to end.
              </p>
              <span className="projects-hint">
                <span className="only-pointer">Keep scrolling →</span>
                <span className="only-touch">Swipe →</span>
              </span>
            </div>
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
          <div className="container projects-progress" aria-hidden="true">
            <div className="projects-progress-track">
              <span ref={barRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const live = project.links.find((link) => link.label !== 'Source') ?? project.links[0];
  const source = project.links.find((link) => link.label === 'Source');

  // Tilt toward the pointer for a subtle 3D feel.
  const onPointerMove = (event) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--ry', `${x * 10}deg`);
    card.style.setProperty('--rx', `${-y * 8}deg`);
  };
  const onPointerLeave = () => {
    cardRef.current.style.setProperty('--ry', '0deg');
    cardRef.current.style.setProperty('--rx', '0deg');
  };

  return (
    <article
      className="pcard"
      ref={cardRef}
      style={{ '--c': project.color }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <a
        className="pcard-overlay"
        href={live.href}
        target="_blank"
        rel="noreferrer"
        data-cursor="view"
        data-cursor-label="View"
        aria-label={`Open ${project.title}`}
      />
      <div className="pcard-cover">
        <img src={project.cover} alt="" loading="lazy" />
        <span className="pcard-date">{project.year}</span>
        <span className="pcard-number">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="pcard-body">
        <div className="pcard-head">
          <div>
            <h3 className="pcard-title">{project.title}</h3>
            <p className="pcard-tagline">{project.tagline}</p>
          </div>
          <a className="pcard-arrow" href={live.href} target="_blank" rel="noreferrer" aria-label={`${project.title} live demo`}>↗</a>
        </div>
        <p className="pcard-desc">{project.description}</p>
        <div className="pcard-foot">
          <div className="tag-row">
            {project.tech.map((tech) => (
              <span className="chip chip-sm" key={tech}>{tech}</span>
            ))}
          </div>
          {source && (
            <a className="pcard-source" href={source.href} target="_blank" rel="noreferrer">Source ↗</a>
          )}
        </div>
      </div>
    </article>
  );
}
