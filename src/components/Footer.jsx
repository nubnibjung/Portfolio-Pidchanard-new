import { profile } from '../data/portfolio.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          Designed & Built by <strong>{profile.name}</strong>
        </p>
        <p className="footer-year">© 2025</p>
      </div>
    </footer>
  );
}
