import { profile, roles } from '../data/portfolio.js';
import { useTypewriter } from '../hooks/useTypewriter.js';
import { EmailIcon, GitHubIcon, LinkedInIcon } from './icons.jsx';

export default function Hero() {
  const roleText = useTypewriter(roles);

  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div className="container">
        <div className="hero-content">
          <span className="hero-greeting reveal">Hello, I'm</span>
          <h1 className="hero-name reveal">
            {profile.name}
            <span className="dot">.</span>
          </h1>
          <span className="hero-location reveal">{profile.location}</span>
          <div className="hero-roles reveal">
            <span className="role">{roleText}</span>
          </div>
          <p className="hero-tagline reveal">{profile.tagline}</p>
          <div className="hero-actions reveal">
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="#contact" className="btn btn-outline">Get in Touch</a>
          </div>
          <div className="hero-socials reveal">
            <a href={profile.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email">
              <EmailIcon />
            </a>
          </div>
        </div>

        <div className="hero-visual reveal">
          <div className="avatar-ring">
            <div className="avatar-inner">
              <img src={profile.photoUrl} alt={`${profile.name} profile`} />
            </div>
          </div>
          <FloatingCard className="fc1" icon="⚡" label="TypeScript" />
          <FloatingCard className="fc2" icon="⚛" label="React" />
          <FloatingCard className="fc3" icon="🚀" label="Next.js" />
        </div>
      </div>

      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

function FloatingCard({ className, icon, label }) {
  return (
    <div className={`floating-card ${className}`}>
      <span className="fc-icon">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
