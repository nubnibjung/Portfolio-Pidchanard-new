import About from './components/About.jsx';
import Achievements from './components/Achievements.jsx';
import Contact from './components/Contact.jsx';
import Cursor from './components/Cursor.jsx';
import Experience from './components/Experience.jsx';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import Navbar from './components/Navbar.jsx';
import ParticleBackground from './components/ParticleBackground.jsx';
import Preloader from './components/Preloader.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Terminal from './components/Terminal.jsx';
import { useRevealOnScroll } from './hooks/useRevealOnScroll.js';
import { useSmoothScroll } from './hooks/useSmoothScroll.js';
import { useWowEffects } from './hooks/useWowEffects.js';

export default function App() {
  useRevealOnScroll();
  useSmoothScroll();
  useWowEffects();

  return (
    <>
      <Preloader />
      <ParticleBackground />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <Terminal />
    </>
  );
}
