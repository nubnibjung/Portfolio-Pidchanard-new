import { projects } from '../data/portfolio.js';
import SectionHeader from './SectionHeader.jsx';
import { ExternalLinkIcon, GitHubIcon } from './icons.jsx';

export default function Projects() {
  return (
    <section className="section section-alt" id="projects">
      <div className="container">
        <SectionHeader label="05. Projects" title="Featured Work" />
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const projectNumber = String(index + 1).padStart(2, '0');

  return (
    <article className="project-card reveal">
      <div className="project-img">
        <div className={`project-placeholder p${index + 1}`}>
          <span>{projectNumber}</span>
        </div>
      </div>
      <div className="project-body">
        <div className="project-meta">
          <span className="project-year">{project.year}</span>
          <div className="project-links">
            {project.links.map((link) => (
              <a href={link.href} target="_blank" rel="noreferrer" aria-label={`${project.title} ${link.label}`} key={link.label}>
                {link.label === 'Source' ? <GitHubIcon size="18" /> : <ExternalLinkIcon />}
              </a>
            ))}
          </div>
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
        <div className="project-tech">
          {project.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
