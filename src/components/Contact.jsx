import { profile } from '../data/portfolio.js';
import { useFitText } from '../hooks/useFitText.js';
import CopyEmail from './CopyEmail.jsx';

const LINKS = [
  { label: 'GitHub', href: profile.githubUrl, external: true },
  { label: 'LinkedIn', href: profile.linkedinUrl, external: true },
  { label: 'Resume', href: profile.resumeUrl, download: profile.resumeFileName },
  { label: 'Email', href: `mailto:${profile.email}` },
];

export default function Contact() {
  const titleRef = useFitText('.contact-title-line', 220);

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="section-eyebrow reveal">
          <span className="section-number">06</span>
          <span className="section-rule" />
          <span className="eyebrow">Contact</span>
        </div>

        <h2 className="contact-title reveal" ref={titleRef}>
          <span className="contact-title-line">Let's build</span>
          <span className="contact-title-line is-accent">something<span className="contact-title-dot">.</span></span>
        </h2>

        <div className="contact-grid">
          <div className="contact-main reveal">
            <p className="contact-text">
              Looking for my next role as a frontend or full-stack developer. Got a project, a question,
              or just want to talk Angular? My inbox is always open.
            </p>
            <CopyEmail email={profile.email} />
          </div>

          <ul className="contact-links reveal">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  download={link.download}
                >
                  {link.label}
                  <span aria-hidden="true">{link.download ? '↓' : '↗'}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
