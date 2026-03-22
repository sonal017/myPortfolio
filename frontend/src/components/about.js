import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './about.css';

const About = memo(() => {
  const shouldReduceMotion = useReducedMotion();

  
  const stats = [
    { label: 'Total Projects', value: '4', description: 'Innovative web & mobile solutions crafted', icon: '📱' },
    { label: 'Years of Experience', value: '2', description: 'Continuous learning journey', icon: '⚡' },
    { label: 'Happy Clients', value: '5+', description: 'Successful project deliveries', icon: '😊' },
  ];

  const experience = [
    {
      title: 'Full Stack Developer',
      company: 'Salaried Position',
      period: '2024 - Present',
      description: 'Building modern web applications with React, Node.js, and MongoDB. Focusing on responsive, performant, accessible solutions with clean architecture and CI/CD process.',
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'REST APIs']
    }
  ];

  const education = [
    {
      degree: 'Bachelor of Information Technology',
      institution: 'Mumbai University',
      score: 'Graduated',
      year: '2021-2024'
    },
    {
      degree: 'HSC (12th) in Science',
      institution: 'Vartak College',
      score: '91.83% [551/600]',
      year: '2020-2021'
    },
    {
      degree: 'SSC (10th)',
      institution: 'Pancham High School',
      score: '90.20% [451/500]',
      year: '2018-2019'
    }
  ];

  const titleAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      };

  const leftAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: -20 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.5 }
      };

  const rightAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 20 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.5 }
      };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          {...titleAnimation}
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-300 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4"
        >
          About Me
        </motion.h2>
      </div>

      {/* Stats Grid */}
      <motion.div
        {...leftAnimation}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            className="h-48 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-xl p-6 text-center flex flex-col items-center justify-center border border-gray-200 dark:border-slate-700"
          >
            <div className="text-4xl mb-2">{stat.icon}</div>
            <dt className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">{stat.value}</dt>
            <dd className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{stat.label}</dd>
            <p className="text-xs text-gray-600 dark:text-gray-300">{stat.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Work Experience & Personal Info - Flip Cards */}
      <motion.div {...rightAnimation} className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Experience & Background</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 perspective max-w-7xl mx-auto">
          <div className="space-y-8">
            {experience.map((job) => (
              <div key={job.title} className="min-h-[20rem] bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-2xl shadow-2xl border border-indigo-700 p-6 text-white">
                <h4 className="text-2xl font-bold mb-2">{job.title}</h4>
                <p className="text-cyan-300 font-semibold mb-1">{job.company}</p>
                <p className="text-sm text-slate-300 mb-4">{job.period}</p>
                <p className="text-slate-200 mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-800/40 text-cyan-100">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-2xl p-6 shadow-2xl border border-indigo-700 text-white">
            <h4 className="text-xl font-bold mb-4">Personal Info & Education</h4>
            <div className="space-y-4 text-sm">
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="font-semibold">Name</p>
                <p>Sonalkumar Singh</p>
                <p className="mt-1 font-semibold">DOB</p>
                <p>17/02/2003</p>
                <p className="mt-1 font-semibold">Status</p>
                <p>Salaried Full Stack Developer</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl">
                <h5 className="font-semibold mb-2">Education</h5>
                {education.map((edu, idx) => (
                  <div key={idx} className="mb-3">
                    <p className="font-semibold">{edu.degree}</p>
                    <p>{edu.institution}</p>
                    <p className="text-xs text-slate-200">{edu.score} • {edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Download CV Button */}
      <motion.div className="text-center">
        <motion.a
          href="/Sonalkumar_CV2026.pdf"
          download
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          className="inline-flex items-center px-8 py-3 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-700 transition-all shadow-xl border border-cyan-400"
          style={{ willChange: 'transform' }}
        >
          📥 Download CV
        </motion.a>
      </motion.div>
    </div>
  );
});

About.displayName = 'About';

export default About;