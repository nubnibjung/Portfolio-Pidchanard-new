import { useMemo, useState } from 'react';
import { skills } from '../data/portfolio.js';
import SectionHeader from './SectionHeader.jsx';
import SkillCloud from './SkillCloud.jsx';

export default function Skills() {
  // Hovering a group in the panel lights up that group's words in the cloud.
  const [activeGroup, setActiveGroup] = useState(null);

  // The first two skills of each group are drawn larger in the cloud.
  const cloudItems = useMemo(
    () => skills.flatMap((group) => group.items.map((name, index) => ({ name, group: group.title, featured: index < 2 }))),
    [],
  );
  const allSkills = cloudItems.map((item) => item.name);
  const half = Math.ceil(allSkills.length / 2);

  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHeader number="03" label="Toolbox" title="My stack" />

        <div className="skills-layout">
          <div className="reveal">
            <SkillCloud items={cloudItems} activeGroup={activeGroup} />
          </div>

          <div className="skill-panel glass reveal" onPointerLeave={() => setActiveGroup(null)}>
            {skills.map((group) => (
              <div
                className={`skill-group ${activeGroup === group.title ? 'is-active' : ''}`}
                key={group.title}
                onPointerEnter={() => setActiveGroup(group.title)}
              >
                <div className="skill-group-head">
                  <h3>{group.title}</h3>
                  <span>{String(group.items.length).padStart(2, '0')}</span>
                </div>
                <div className="tag-row">
                  {group.items.map((item) => (
                    <span className="chip chip-sm" key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="marquee-wrap reveal" aria-hidden="true">
        <Marquee items={allSkills.slice(0, half)} />
        <Marquee items={allSkills.slice(half)} outline />
      </div>
    </section>
  );
}

function Marquee({ items, outline = false }) {
  const row = [...items, ...items];

  return (
    <div className={`marquee ${outline ? 'is-outline' : ''}`}>
      <div className="marquee-track">
        {row.map((item, index) => (
          <span className="marquee-item" key={`${item}-${index}`}>
            {item}
            <span className="marquee-star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
