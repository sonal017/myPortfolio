import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  SiReact,
  SiJavascript,
  SiNodedotjs,
  SiPhp,
  SiMongodb,
  SiExpress,
  SiTailwindcss,
  SiGit,
  SiHtml5,
  SiCss3,
  SiTypescript,
  SiPython
} from 'react-icons/si';

const Skills = memo(() => {
  const shouldReduceMotion = useReducedMotion();
  
  const skills = [
    {
      category: 'Frontend Development',
      items: [
        { name: 'React', icon: <SiReact className="w-8 h-8" />, level: 90 },
        { name: 'JavaScript', icon: <SiJavascript className="w-8 h-8" />, level: 85 },
        { name: 'HTML5', icon: <SiHtml5 className="w-8 h-8" />, level: 95 },
        { name: 'CSS3', icon: <SiCss3 className="w-8 h-8" />, level: 90 },
        { name: 'TypeScript', icon: <SiTypescript className="w-8 h-8" />, level: 80 },
        { name: 'Tailwind CSS', icon: <SiTailwindcss className="w-8 h-8" />, level: 85 }
      ]
    },
    {
      category: 'Backend Development',
      items: [
        { name: 'Node.js', icon: <SiNodedotjs className="w-8 h-8" />, level: 85 },
        { name: 'Express.js', icon: <SiExpress className="w-8 h-8" />, level: 80 },
        { name: 'PHP', icon: <SiPhp className="w-8 h-8" />, level: 75 },
        { name: 'MongoDB', icon: <SiMongodb className="w-8 h-8" />, level: 80 },
        { name: 'Python', icon: <SiPython className="w-8 h-8" />, level: 75 },
        { name: 'Git', icon: <SiGit className="w-8 h-8" />, level: 85 }
      ]
    }
  ];

  const titleAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          {...titleAnimation}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        >
          Skills & Technologies
        </motion.h2>
        <p className="text-lg text-gray-600">
          A collection of technologies I work with to build digital solutions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {skills.map((skillCategory, categoryIndex) => {
          const cardAnimation = shouldReduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                transition: { duration: 0.5, delay: categoryIndex * 0.1 }
              };

          return (
            <motion.div
              key={skillCategory.category}
              {...cardAnimation}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {skillCategory.category}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {skillCategory.items.map((skill, index) => {
                  const progressAnimation = shouldReduceMotion
                    ? { width: `${skill.level}%` }
                    : {
                        initial: { width: 0 },
                        whileInView: { width: `${skill.level}%` },
                        transition: { duration: 0.8, delay: index * 0.05 }
                      };

                  return (
                    <motion.div
                      key={skill.name}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                      className="space-y-2 transform transition-transform duration-300"
                      style={{ willChange: 'transform' }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-600">
                          {skill.icon}
                        </div>
                        <span className="text-gray-900 dark:text-slate-200 font-medium">{skill.name}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          {...progressAnimation}
                          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                          style={{ willChange: 'width' }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

Skills.displayName = 'Skills';

export default Skills;