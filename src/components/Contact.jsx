import { profile } from '../data/portfolio.js';
import SectionHeader from './SectionHeader.jsx';

export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <SectionHeader label="07. Contact" title="Get In Touch" />
        <div className="contact-inner reveal">
          <p className="contact-text">
            I'm currently open to new opportunities. Whether you have a project in mind,
            a question, or just want to say hello - my inbox is always open.
            <br />
            {profile.location}
          </p>
          <a href={`mailto:${profile.email}`} className="btn btn-primary btn-lg">Say Hello</a>
          <div className="contact-socials">
            <a href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
            <span>·</span>
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
            <span>·</span>
            <a href={`mailto:${profile.email}`}>Email</a>
          </div>
        </div>
      </div>
    </section>
  );
}
