import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const updateActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * 0.45;
      const currentSection = [...sectionIds].reverse().find((id) => {
        const section = document.getElementById(id);
        return section && marker >= section.offsetTop;
      });

      setActiveSection(currentSection || '');
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });

    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [sectionIds]);

  return activeSection;
}
