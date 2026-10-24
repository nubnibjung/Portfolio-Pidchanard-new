import { profile } from '../data/portfolio.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-row">
        <span>© {new Date().getFullYear()} {profile.name} {profile.surname} — {profile.tagline.toLowerCase()}.</span>
        <span className="footer-hint only-pointer">psst… try ↑↑↓↓←→←→BA</span>
        <a href="#hero">Back to top ↑</a>
      </div>
    </footer>
  );
}
