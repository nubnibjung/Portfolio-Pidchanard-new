import { useEffect, useRef } from 'react';
import { projects } from '../data/portfolio.js';
import SectionHeader from './SectionHeader.jsx';
import { getScrollTarget, scrollToY } from '../hooks/useSmoothScroll.js';

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
    const pinTop = () => pin.getBoundingClientRect().top + window.scrollY;

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

    // Desktop: sideways trackpad swipes / shift+wheel move the page like vertical scroll does.
    const onWheel = (event) => {
      if (!media.matches || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      const position = getScrollTarget() - pinTop();
      // Let the gesture pass through once the row is already at that end.
      if ((event.deltaX < 0 && position <= 0) || (event.deltaX > 0 && position >= distance)) return;
      event.preventDefault();
      scrollToY(getScrollTarget() + event.deltaX, { instant: true });
    };
    track.addEventListener('wheel', onWheel, { passive: false });

    // Desktop: drag the row with the mouse.
    let drag = null;
    const onPointerDown = (event) => {
      if (!media.matches || event.pointerType !== 'mouse' || event.button !== 0) return;
      drag = { x: event.clientX, start: getScrollTarget(), moved: false };
    };
    const onPointerMove = (event) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < 6) return;
      drag.moved = true;
      track.classList.add('is-dragging');
      const top = pinTop();
      scrollToY(Math.min(top + distance, Math.max(top, drag.start - dx * 1.4)), { instant: true });
    };
    const onPointerUp = () => {
      if (!drag) return;
      track.classList.remove('is-dragging');
      // Swallow the click that ends a drag so it doesn't open a project.
      if (drag.moved) window.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); }, { capture: true, once: true });
      drag = null;
    };
    const onDragStart = (event) => event.preventDefault();
    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('dragstart', onDragStart);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

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
      track.removeEventListener('wheel', onWheel);
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('dragstart', onDragStart);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      media.removeEventListener('change', measure);
    };
  }, []);

  // Prev/next buttons: glide until the neighbouring card is centred on screen.
  const step = (direction) => {
    const pin = pinRef.current;
    const track = trackRef.current;
    const top = pin.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(0, track.scrollWidth - window.innerWidth);
    const trackLeft = track.getBoundingClientRect().left;
    const stops = [0, ...[...track.querySelectorAll('.pcard')].map((card) => {
      const rect = card.getBoundingClientRect();
      return Math.min(distance, Math.max(0, rect.left - trackLeft + rect.width / 2 - window.innerWidth / 2));
    })];
    const position = getScrollTarget() - top;
    const next = direction > 0
      ? stops.find((stop) => stop > position + 4) ?? distance
      : stops.findLast((stop) => stop < position - 4) ?? 0;
    scrollToY(top + next);
  };

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <SectionHeader number="04" label="Selected projects" title="Things I've built" />
      </div>

      <div className="projects-pin" ref={pinRef}>
        <div className="projects-sticky">
          <div className="projects-track" ref={trackRef} data-cursor="drag" data-cursor-label="Drag">
            <div className="projects-intro">
              <p>
                From coursework to side projects: video editing, online shops and booking systems,
                each built end to end.
              </p>
              <span className="projects-hint">
                <span className="only-pointer">Scroll or drag →</span>
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
            <div className="projects-nav">
              <button type="button" onClick={() => step(-1)} aria-label="Previous project">←</button>
              <button type="button" onClick={() => step(1)} aria-label="Next project">→</button>
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
