import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const updateActiveSection = () => {
      const currentSection = [...sectionIds].reverse().find((id) => {
        const section = document.getElementById(id);
        return section && window.scrollY >= section.offsetTop - 120;
      });

      setActiveSection(currentSection || '');
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });

    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [sectionIds]);

  return activeSection;
}
