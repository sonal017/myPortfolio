import React, { memo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-scroll';
import GradientText from './GradientText';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const Header = memo(() => {
  const shouldReduceMotion = useReducedMotion();
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [greeting, setGreeting] = useState('Hello there!');

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    setEyeOffset({
      x: clamp(x / 9, -8, 8),
      y: clamp(y / 9, -8, 8),
    });
  };

  const handleMouseLeave = () => {
    setEyeOffset({ x: 0, y: 0 });
  };

  const handleStickerClick = () => {
    setGreeting('👋 Hi! Thanks for checking out my portfolio!');
    setTimeout(() => {
      setGreeting('Hello there!');
    }, 2500);
  };

  const fadeIn = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
      };

  const imageAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 }
      };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-20 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            {...fadeIn}
            className="text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <GradientText
                colors={['#3b82f6', '#10b981', '#3b82f6']}
                animationSpeed={6}
                className="font-bold"
              >
                Full Stack Developer
              </GradientText>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Enhancing digital experiences that are smooth, scalable, and made to impress.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.span
                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-800 dark:text-slate-200 text-sm font-medium border border-gray-200 dark:border-slate-600"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                React
              </motion.span>
              <motion.span
                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-800 dark:text-slate-200 text-sm font-medium border border-gray-200 dark:border-slate-600"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                JavaScript
              </motion.span>
              <motion.span
                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-800 dark:text-slate-200 text-sm font-medium border border-gray-200 dark:border-slate-600"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                Node.js
              </motion.span>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="projects" smooth={true} duration={500} offset={-80}>
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  style={{ willChange: 'transform' }}
                  aria-label="Navigate to projects section"
                >
                  View Projects
                </motion.button>
              </Link>
              <motion.a
                href="https://drive.google.com/uc?export=download&id=1Bcz_eBJXtncLERQrnffb3BqmYpi2O9S2"
                download="Sonalkumar_Singh_CV.pdf"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                style={{ willChange: 'transform' }}
                aria-label="Download CV"
              >
               Download CV
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            {...imageAnimation}
            className="relative h-[400px] w-full"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-10"></div>
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
              <div
                className="w-full h-full bg-white/10 rounded-xl backdrop-blur-lg p-4 flex flex-col items-center justify-center cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleStickerClick}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-300 to-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="relative w-8 h-8 bg-white rounded-full border-2 border-slate-600" style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}></div>
                  <div className="relative w-8 h-8 bg-white rounded-full border-2 border-slate-600 ml-3" style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}></div>
                </div>
                <p className="text-white font-semibold mt-3">{greeting}</p>
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