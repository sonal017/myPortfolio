import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiAward, FiBookOpen, FiBriefcase, FiCheckCircle, FiCode, FiDownload, FiMapPin } from 'react-icons/fi';
import './about.css';

const About = memo(() => {
  const shouldReduceMotion = useReducedMotion();

  const stats = [
    {
      label: 'Featured Projects',
      value: '4',
      description: 'React, Node.js, API, commerce, and weather UI builds',
      icon: <FiCode className="h-6 w-6" />,
    },
    {
      label: 'Experience',
      value: '1+ yr',
      description: 'Hands-on full-stack development experience',
      icon: <FiBriefcase className="h-6 w-6" />,
    },
    {
      label: 'Current Focus',
      value: 'MERN',
      description: 'Building clean interfaces with practical backend APIs',
      icon: <FiAward className="h-6 w-6" />,
    },
  ];

  const profilePoints = [
    'Build responsive React interfaces with clear component structure.',
    'Create Express and MongoDB APIs for forms, dashboards, and data workflows.',
    'Develop receipt generation and PDF-based workflows with backend API integration.',
    'Build scheduling features with drag-and-drop interactions and timezone-aware logic.',
    'Refactor reusable UI components to improve product consistency and development speed.',
    'Implement profile, organization, and social account management flows with modal-based UI.',
    'Care about clean UX, performance, accessibility, and maintainable code.',
  ];

  const experience = [
    {
      title: 'Full Stack Developer',
      company: 'Digitrix Agency, Vasai',
      period: 'Jun 2025 - Present',
      description:
        'Working on React-based product features including receipt generation, drag-and-drop scheduling, timezone-aware social planning, modal-based account flows, and reusable UI refactors.',
      skills: ['React', 'React DnD', 'Node.js', 'Express', 'MongoDB', 'REST APIs'],
    },
  ];

  const education = [
    {
      degree: 'Bachelor of Information Technology',
      institution: 'Mumbai University',
      score: 'Graduated',
      year: '2021 - 2024',
    },
    {
      degree: 'HSC Science',
      institution: 'Vartak College',
      score: '91.83%',
      year: '2020 - 2021',
    },
    {
      degree: 'SSC',
      institution: 'Pancham High School',
      score: '90.20%',
      year: '2018 - 2019',
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
          About
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          A developer focused on useful, polished web experiences.
        </h2>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
          I enjoy building products that combine clear UI, dependable backend logic, and a smooth user journey from first click to final action.
        </p>
      </motion.div>

      <motion.div {...fadeUp} className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
              {stat.icon}
            </div>
            <p className="mt-5 text-3xl font-bold text-slate-950 dark:text-white">{stat.value}</p>
            <h3 className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{stat.label}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{stat.description}</p>
          </div>
        ))}
      </motion.div>

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          {...fadeUp}
          className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <FiMapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white">Profile Snapshot</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Mumbai, India</p>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            {profilePoints.map((point) => (
              <div key={point} className="flex gap-3">
                <FiCheckCircle className="mt-1 h-5 w-5 flex-none text-emerald-500" />
                <p className="leading-7 text-slate-600 dark:text-slate-300">{point}</p>
              </div>
            ))}
          </div>

          <a
            href="/Sonalkumar_CV2026.pdf"
            download
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-900/15 transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <FiDownload className="h-5 w-5" />
            Download CV
          </a>
        </motion.div>

        <motion.div {...fadeUp} className="space-y-6">
          {experience.map((job) => (
            <article
              key={job.title}
              className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white">{job.title}</h3>
                  <p className="mt-1 font-semibold text-cyan-700 dark:text-cyan-300">{job.company}</p>
                </div>
                <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {job.period}
                </span>
              </div>

              <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">{job.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}

          <article className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                <FiBookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white">Education</h3>
            </div>

            <div className="mt-6 space-y-5">
              {education.map((edu) => (
                <div key={`${edu.degree}-${edu.year}`} className="border-l-2 border-slate-200 pl-4 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-950 dark:text-white">{edu.degree}</h4>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">{edu.institution}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {edu.score} / {edu.year}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </motion.div>
      </div>
    </div>
  );
});

About.displayName = 'About';

export default About;
