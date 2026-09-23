import React, { useState } from 'react';
import { FiArrowUpRight, FiGithub, FiImage } from 'react-icons/fi';

const projects = [
  {
    title: 'SlotMate', category: 'Shopify booking', ownership: 'Company project',
    description: 'Turn Shopify products into bookable services with flexible scheduling.',
    contribution: 'Merchant configuration, slot availability, and booking API flows.',
    image: '/slotmate-preview.png', technologies: ['React', 'Node.js', 'Shopify', 'Express'],
    liveDemo: 'https://digitrix.agency/apps/slotmate', linkLabel: 'Visit website',
  },
  {
    title: 'Ezhog', category: 'AI & learning', ownership: 'Company project',
    description: 'AI-assisted research, quizzes, and question solving in one workspace.',
    contribution: 'Asynchronous AI flows, webhooks, citations, and loading feedback.',
    image: '/ezhog-preview.png', technologies: ['Next.js', 'Node.js', 'OpenAI API', 'Webhooks'],
    liveDemo: 'https://www.ezhog.com/', linkLabel: 'Visit website',
  },
  {
    title: 'CreateReceipt', category: 'Document generation', ownership: 'Company project',
    description: 'A receipt builder with customizable forms and downloadable PDFs.',
    contribution: 'Reusable form components, HTML-to-PDF styling, and API integration.',
    image: '/createreceipt-preview.png', technologies: ['React', 'HTML-to-PDF', 'REST APIs'],
    liveDemo: 'https://www.createreceipt.com/', linkLabel: 'Visit website',
  },
  {
    title: 'DulyPlan', category: 'Social scheduling', ownership: 'Company project',
    description: 'Plan social content with a calendar built around real publishing workflows.',
    contribution: 'Drag-and-drop scheduling, timezone logic, and event grouping.',
    image: '/dulyplan-preview.png', technologies: ['React', 'React DnD', 'REST APIs'],
    liveDemo: 'https://dulyplan.com/', linkLabel: 'Visit website',
  },
  {
    title: 'Stack Overflow Clone', category: 'Community platform', ownership: 'Personal project',
    description: 'A full-stack Q&A community with questions, answers, voting, and tags.',
    contribution: 'Connected authentication and community features across the MERN stack.',
    image: '/codequest-preview.png', technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    liveDemo: 'https://codequest-stack-overflow.netlify.app/', linkLabel: 'Live demo',
    github: 'https://github.com/sonal017/codequest',
  },
  {
    title: '2D RPG Game', category: 'Game development', ownership: 'Academic project',
    description: 'A Zelda-inspired adventure with enemies, exploration, and level progression.',
    contribution: 'Player movement, enemy behavior, collision detection, and map progression.',
    image: '/rpg-preview.png', technologies: ['Python', 'Pygame', 'Enemy AI'],
    liveDemo: 'https://2-d-rpg-game.vercel.app/', linkLabel: 'Play game',
  },
];

function ProjectCard({ project, index }) {
  const [imageError, setImageError] = useState(false);
  return (
    <article className="project-card">
      <a className="project-preview" href={project.liveDemo} target="_blank" rel="noopener noreferrer" aria-label={'Open ' + project.title}>
        {imageError ? <span className="preview-fallback"><FiImage aria-hidden="true" />{project.title}</span> :
          <img src={project.image} alt={project.title + ' website screenshot'} width="1280" height="720" loading={index < 2 ? 'eager' : 'lazy'} decoding="async" onError={() => setImageError(true)} />}
        <span className="preview-open" aria-hidden="true"><FiArrowUpRight /></span>
      </a>
      <div className="project-content">
        <div className="project-meta"><span>{project.category}</span><span>{project.ownership}</span></div>
        <div className="project-title"><h3><a href={project.liveDemo} target="_blank" rel="noopener noreferrer">{project.title}</a></h3><span className="project-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div>
        <p className="project-description">{project.description}</p>
        <p className="project-contribution"><span>My contribution</span>{project.contribution}</p>
        <ul className="technology-list" aria-label={project.title + ' technologies'}>
          {project.technologies.map((tech) => <li key={tech}>{tech}</li>)}
        </ul>
        <div className="project-links">
          <a className="text-link" href={project.liveDemo} target="_blank" rel="noopener noreferrer" aria-label={project.linkLabel + ': ' + project.title}>{project.linkLabel}<FiArrowUpRight aria-hidden="true" /></a>
          {project.github && <a className="text-link" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={'Source code: ' + project.title}><FiGithub aria-hidden="true" />Source code</a>}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <div className="page-width">
      <div className="section-heading work-heading">
        <div><p className="eyebrow">01 / Selected work</p><h2>Projects in the real world.</h2></div>
        <p className="section-aside">Company work & independent builds<span className="project-count">{String(projects.length).padStart(2, '0')}</span></p>
      </div>
      <div className="project-grid">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.title} />)}</div>
    </div>
  );
}
