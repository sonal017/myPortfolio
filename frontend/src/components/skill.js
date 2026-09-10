import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  SiCss3,
  SiExpress,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiMui,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostman,
  SiPython,
  SiReact,
  SiRender,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from 'react-icons/si';

const Skills = memo(() => {
  const shouldReduceMotion = useReducedMotion();

  const skillGroups = [
    {
      category: 'Frontend',
      summary: 'Interfaces that are responsive, accessible, and easy to maintain.',
      items: [
        { name: 'React.js', icon: <SiReact /> },
        { name: 'Next.js', icon: <SiNextdotjs /> },
        { name: 'JavaScript', icon: <SiJavascript /> },
        { name: 'TypeScript', icon: <SiTypescript /> },
        { name: 'HTML5', icon: <SiHtml5 /> },
        { name: 'CSS3', icon: <SiCss3 /> },
        { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
        { name: 'MUI', icon: <SiMui /> },
      ],
    },
    {
      category: 'Backend & Data',
      summary: 'API flows, server logic, and database-backed features.',
      items: [
        { name: 'Node.js', icon: <SiNodedotjs /> },
        { name: 'Express.js', icon: <SiExpress /> },
        { name: 'MongoDB', icon: <SiMongodb /> },
        { name: 'SQL', icon: <SiMysql /> },
        { name: 'REST APIs', icon: <SiExpress /> },
        { name: 'Python', icon: <SiPython /> },
      ],
    },
    {
      category: 'Workflow',
      summary: 'Daily tools for source control, testing APIs, and shipping work.',
      items: [
        { name: 'Git', icon: <SiGit /> },
        { name: 'Postman', icon: <SiPostman /> },
        { name: 'Vercel', icon: <SiVercel /> },
        { name: 'Render', icon: <SiRender /> },
      ],
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
          Skills
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          A practical stack for modern full-stack products.
        </h2>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
          I focus on tools that help me build clean interfaces, reliable APIs, and production-ready deployments.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <motion.article
            key={group.category}
            {...(shouldReduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: '-80px' },
                  transition: { duration: 0.45, delay: index * 0.08, ease: 'easeOut' },
                })}
            className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20"
          >
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white">{group.category}</h3>
            <p className="mt-3 min-h-[4rem] leading-7 text-slate-600 dark:text-slate-300">{group.summary}</p>

            <div className="mt-7 grid grid-cols-1 gap-3">
              {group.items.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
                >
                  <span className="text-xl text-cyan-600 dark:text-cyan-300">{skill.icon}</span>
                  <span className="font-semibold">{skill.name}</span>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
});

Skills.displayName = 'Skills';

export default Skills;
