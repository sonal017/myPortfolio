import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const About = memo(() => {
  const shouldReduceMotion = useReducedMotion();
  const stats = [
    { label: 'Total Projects', value: '4', description: 'Innovative web & mobile solutions crafted' },
    { label: 'Certificates', value: '3', description: 'Professional skills validated' },
    { label: 'Years of Experience', value: '2', description: 'Continuous learning journey' },
  ];

  const education = [
    {
      degree: 'BSc in Information Technology',
      score: '8.85/10 CGPA',
      year: '2021-2024'
    },
    {
      degree: 'HSC (12th)',
      institution: 'Vartak College',
      score: '91.83% [551/600]',
      year: '2020-2021'
    },
    {
      degree: 'SSC (10th)',
      institution: 'Panchan Hindi High School',
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
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        >
          About Me
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Text Content and Education */}
        <motion.div
          {...leftAnimation}
          className="text-left"
        >
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
            <p className="text-lg text-gray-600 mb-4">
              <span className="font-medium">Name:</span> Sonalkumar Singh
            </p>
            <p className="text-lg text-gray-600 mb-6">
              <span className="font-medium">Date of Birth:</span> 17/02/2003
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Education</h3>
            {education.map((item, index) => (
              <div key={index} className="mb-4">
                <h4 className="text-lg font-medium text-gray-900">{item.degree}</h4>
                {item.institution && (
                  <p className="text-gray-600">{item.institution}</p>
                )}
                <p className="text-gray-600">
                  {item.score} • {item.year}
                </p>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            style={{ willChange: 'transform' }}
          >
            Download CV
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          {...rightAnimation}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center transform transition-transform duration-300"
              style={{ willChange: 'transform' }}
            >
              <dt className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</dt>
              <dd className="text-sm font-medium text-gray-900 mb-1">{stat.label}</dd>
              <dd className="text-sm text-gray-500">{stat.description}</dd>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
});

About.displayName = 'About';

export default About;