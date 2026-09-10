import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FiArrowRight, FiCheckCircle, FiDownload, FiMail } from 'react-icons/fi';
import { SiMongodb, SiNodedotjs, SiReact, SiTailwindcss } from 'react-icons/si';

const Header = memo(() => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: 'easeOut' },
      };

  const visualAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.65, delay: 0.12, ease: 'easeOut' },
      };

  const techStack = [
    { name: 'React', icon: <SiReact className="h-4 w-4" /> },
    { name: 'Node.js', icon: <SiNodedotjs className="h-4 w-4" /> },
    { name: 'MongoDB', icon: <SiMongodb className="h-4 w-4" /> },
    { name: 'Tailwind', icon: <SiTailwindcss className="h-4 w-4" /> },
  ];

  const stats = [
    { value: '4', label: 'Featured projects' },
    { value: '1+ yr', label: 'Hands-on experience' },
    { value: 'MERN', label: 'Primary stack' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white pt-28 dark:bg-slate-950 sm:pt-32">
      <div className="absolute inset-x-0 top-16 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent dark:via-cyan-900" />

      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
          <motion.div {...fadeUp} className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Available for full-stack roles and freelance work
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Hi, I&apos;m Sonalkumar Singh. I build full-stack web apps that feel fast and reliable.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
              I turn product ideas into responsive React interfaces, clean Node.js APIs, and practical user experiences that are easy to use and maintain.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech.name}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <span className="text-cyan-600 dark:text-cyan-300">{tech.icon}</span>
                  {tech.name}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link to="projects" smooth duration={500} offset={-72} className="w-full sm:w-auto">
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/15 transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:w-auto"
                  type="button"
                >
                  View Projects
                  <FiArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>

              <motion.a
                href="/Sonalkumar_CV2026.pdf"
                download
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 shadow-sm transition-colors hover:border-slate-950 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-400 sm:w-auto"
              >
                <FiDownload className="h-5 w-5" />
                Download CV
              </motion.a>

              <Link to="contact" smooth duration={500} offset={-72} className="w-full sm:w-auto">
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-base font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white sm:w-auto"
                  type="button"
                >
                  <FiMail className="h-5 w-5" />
                  Contact Me
                </motion.button>
              </Link>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</dt>
                  <dd className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div {...visualAnimation} className="relative">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Portfolio Preview
                </span>
              </div>

              <div className="bg-slate-950 p-3">
                <img
                  src="/portfolio-preview.png"
                  alt="Screenshot preview of Sonalkumar Singh portfolio website"
                  className="aspect-[16/9] w-full rounded-md border border-white/10 object-cover"
                  loading="eager"
                />
              </div>

              <div className="grid grid-cols-1 divide-y divide-slate-200 text-sm dark:divide-slate-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[
                  'Responsive UI',
                  'Clean APIs',
                  'Deploy-ready',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 px-4 py-4 text-slate-700 dark:text-slate-200">
                    <FiCheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;
