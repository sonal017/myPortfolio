import React from 'react';
import { SiCss3, SiExpress, SiGit, SiHtml5, SiJavascript, SiMui, SiMongodb, SiMysql, SiNextdotjs, SiNodedotjs, SiPostman, SiPython, SiReact, SiRender, SiTailwindcss, SiTypescript, SiVercel } from 'react-icons/si';
import { FiServer } from 'react-icons/fi';

const groups = [
  { title: 'Frontend', number: '01', items: [['React', SiReact], ['Next.js', SiNextdotjs], ['JavaScript', SiJavascript], ['TypeScript', SiTypescript], ['HTML5', SiHtml5], ['CSS3', SiCss3], ['Tailwind CSS', SiTailwindcss], ['MUI', SiMui]] },
  { title: 'Backend & data', number: '02', items: [['Node.js', SiNodedotjs], ['Express', SiExpress], ['MongoDB', SiMongodb], ['SQL', SiMysql], ['REST APIs', FiServer], ['Python', SiPython]] },
  { title: 'Tools & deployment', number: '03', items: [['Git', SiGit], ['Postman', SiPostman], ['Vercel', SiVercel], ['Render', SiRender]] },
];

export default function Skills() {
  return (
    <div className="page-width">
      <div className="section-heading"><div><p className="eyebrow">03 / My toolkit</p><h2>The tools behind the work.</h2></div></div>
      <div className="skills-grid">
        {groups.map((group) => <div className="skill-group" key={group.title}>
          <div className="skill-heading"><span>{group.number}</span><h3>{group.title}</h3></div>
          <ul>{group.items.map(([name, Icon]) => <li key={name}><Icon aria-hidden="true" /><span>{name}</span></li>)}</ul>
        </div>)}
      </div>
    </div>
  );
}
