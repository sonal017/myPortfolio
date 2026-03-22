import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  SiReact,
  SiJavascript,
  SiNodedotjs,
  SiMongodb,
  SiExpress,
  SiTailwindcss,
  SiGit,
  SiHtml5,
  SiCss3,
  SiTypescript
} from 'react-icons/si';

const Skills = memo(() => {
  const shouldReduceMotion = useReducedMotion();
  
  const skills = [
    {
      category: 'Frontend Development',
      color: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30',
      items: [
        { name: 'React.js', icon: <SiReact className="w-6 h-6" />, level: 90 },
        { name: 'Next.js', icon: <SiJavascript className="w-6 h-6" />, level: 85 },
        { name: 'JavaScript', icon: <SiJavascript className="w-6 h-6" />, level: 85 },
        { name: 'TypeScript', icon: <SiTypescript className="w-6 h-6" />, level: 80 },
        { name: 'HTML5', icon: <SiHtml5 className="w-6 h-6" />, level: 95 },
        { name: 'CSS3', icon: <SiCss3 className="w-6 h-6" />, level: 90 },
        { name: 'Tailwind CSS', icon: <SiTailwindcss className="w-6 h-6" />, level: 85 }
      ]
    },
    {
      category: 'Backend Development',
      color: 'from-violet-500/20 to-purple-500/20',
      borderColor: 'border-violet-500/30',
      items: [
        { name: 'Node.js', icon: <SiNodedotjs className="w-6 h-6" />, level: 85 },
        { name: 'Express.js', icon: <SiExpress className="w-6 h-6" />, level: 80 },
        { name: 'MongoDB', icon: <SiMongodb className="w-6 h-6" />, level: 80 },
        { name: 'REST APIs', icon: <SiExpress className="w-6 h-6" />, level: 85 }
      ]
    },
    {
      category: 'Tools & Technologies',
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/30',
      items: [
        { name: 'Git', icon: <SiGit className="w-6 h-6" />, level: 85 },
        { name: 'Postman', icon: <SiJavascript className="w-6 h-6" />, level: 80 },
        { name: 'Vercel', icon: <SiJavascript className="w-6 h-6" />, level: 75 },
        { name: 'Render', icon: <SiJavascript className="w-6 h-6" />, level: 75 }
      ]
    }
  ];

  const titleAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
      };

  const containerAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { staggerChildren: 0.1, duration: 0.6 }
      };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            {...titleAnimation}
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-300 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4"
          >
            Skills & Technologies
          </motion.h2>
          <motion.p 
            {...titleAnimation}
            className="text-lg text-gray-700 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Expertise in modern full-stack development with focus on clean code and scalable architecture
          </motion.p>
        </div>

        <motion.div {...containerAnimation} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                whileHover={shouldReduceMotion ? {} : { y: -8 }}
                className={`bg-gradient-to-br ${skillCategory.color} dark:${skillCategory.color} backdrop-blur-xl border ${skillCategory.borderColor} dark:${skillCategory.borderColor} rounded-2xl p-8 shadow-2xl dark:shadow-xl hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group bg-white/80 dark:bg-slate-900/80`}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center justify-between">
                  {skillCategory.category}
                  <span className="w-1 h-8 bg-gradient-to-b from-cyan-500 dark:from-cyan-400 to-transparent rounded-full" />
                </h3>
                
                <div className="space-y-6">
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
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-cyan-600 dark:text-cyan-300 group-hover:text-cyan-700 dark:group-hover:text-cyan-200 transition-colors">
                              {skill.icon}
                            </div>
                            <span className="text-gray-800 dark:text-slate-200 font-semibold text-sm">{skill.name}</span>
                          </div>
                          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-300">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-gray-300 dark:bg-slate-700/50 rounded-full overflow-hidden backdrop-blur">
                          <motion.div
                            {...progressAnimation}
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 rounded-full shadow-lg dark:shadow-cyan-500/50"
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
        </motion.div>
      </div>
    </div>
  );
});

Skills.displayName = 'Skills';

export default Skills;