import React, { useState, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight, FiExternalLink, FiGithub } from 'react-icons/fi';

const ProjectCard = memo(({ project, index }) => {
  const shouldReduceMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);

  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.5, delay: index * 0.08, ease: 'easeOut' },
      };

  return (
    <motion.article
      {...animationProps}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/25"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {!imageError ? (
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-cyan-50 text-sm font-semibold text-slate-500 dark:from-slate-800 dark:to-slate-900 dark:text-slate-400">
            Preview unavailable
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-md bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-700 shadow-sm backdrop-blur dark:bg-slate-950/85 dark:text-slate-200">
          {project.type}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{project.title}</h3>
          <FiArrowUpRight className="mt-1 h-5 w-5 flex-none text-slate-400 transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-300" />
        </div>

        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{project.description}</p>

        <p className="mt-4 rounded-md border border-cyan-100 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-800 dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-200">
          {project.outcome}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 pt-2">
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              aria-label={`Open live demo for ${project.title}`}
            >
              <FiExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-400"
              aria-label={`Open GitHub repository for ${project.title}`}
            >
              <FiGithub className="h-4 w-4" />
              GitHub Repo
            </a>
          )}

          {project.status && (
            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {project.status}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
});

ProjectCard.displayName = 'ProjectCard';

const Projects = () => {
  const shouldReduceMotion = useReducedMotion();

  const projects = [
    {
      title: 'SlotMate',
      type: 'Shopify App',
      description:
        'Shopify booking app where merchants can convert existing store products into bookable services or create standalone services.',
      outcome:
        'Worked across merchant configuration, storefront service selection, slot availability, booking confirmation, and Node.js API flows.',
      image: '/slotmate-preview.png',
      technologies: ['React', 'Node.js', 'Express', 'Shopify', 'REST APIs', 'Booking Logic'],
      liveDemo: 'https://digitrix.agency/apps/slotmate',
      status: 'Work Project',
    },
    {
      title: 'Ezhog',
      type: 'AI Product',
      description:
        'AI-powered platform for research, quiz generation, question solving, and learning workflows built around fast assistant-style experiences.',
      outcome:
        'Worked on asynchronous AI flows, webhook handling, citation-style responses, loading states, and polished product UI feedback.',
      image: '/ezhog-preview.png',
      technologies: ['Next.js', 'Node.js', 'OpenAI API', 'Webhooks', 'Async UI', 'Product UI'],
      liveDemo: 'https://www.ezhog.com/',
      status: 'Private Work',
    },
    {
      title: 'CreateReceipt',
      type: 'Work Project',
      description:
        'React receipt generator with dynamic PDF generation using HTML-to-PDF conversion, custom styling, and backend API integration.',
      outcome: 'Refactored form and input logic into reusable components to keep document generation screens easier to maintain.',
      image: '/createreceipt-preview.png',
      technologies: ['React', 'HTML-to-PDF', 'Backend API', 'Custom Styling', 'Reusable Forms'],
      liveDemo: 'https://www.createreceipt.com/',
      status: 'Office Project',
    },
    {
      title: 'DulyPlan',
      type: 'Work Project',
      description:
        'Social scheduling product with a React DnD calendar, multiple views, timezone-based scheduling, and post detail workflows.',
      outcome:
        'Improved event grouping, profile and organization flows, reusable components, and performance for larger planning datasets.',
      image: '/dulyplan-preview.png',
      technologies: ['React', 'React DnD', 'Timezone Logic', 'Event Grouping', 'Sidebar UI'],
      liveDemo: 'https://dulyplan.com/',
      status: 'Private Work',
    },
    {
      title: 'Stack Overflow Clone',
      type: 'Full Stack',
      description:
        'Full-stack Q&A platform inspired by Stack Overflow with authentication, question posting, answers, voting, and tagging.',
      outcome: 'Connected a React frontend with Node.js, Express, and MongoDB to support core community Q&A flows.',
      image: '/codequest-preview.png',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Authentication'],
      liveDemo: 'https://codequest-stack-overflow.netlify.app/',
      github: 'https://github.com/sonal017/codequest',
    },
    {
      title: '2D RPG Game',
      type: 'Final Year Project',
      description:
        'Legend of Zelda-inspired role-playing game with character movement, enemy AI, collision detection, and level progression.',
      outcome: 'Built core gameplay mechanics in Python, including movement systems, enemy behavior, and map progression.',
      image: '/rpg-preview.svg',
      technologies: ['Python', 'Pygame', 'Enemy AI', 'Collision Detection', 'Level Progression'],
      status: 'Academic Project',
    },
  ];

  const fadeUp = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.5, ease: 'easeOut' },
      };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
          Projects
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Product work from my latest resume.
        </h2>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
          Shopify booking, AI writing tools, scheduling products, PDF generation, and full-stack practice projects.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};

export default memo(Projects);
