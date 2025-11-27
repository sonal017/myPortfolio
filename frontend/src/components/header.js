import React, { useState, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-scroll';
import GradientText from './GradientText';

const Header = memo(() => {
  const shouldReduceMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const textAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
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
            {...textAnimation}
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
            <div className="mt-8">
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
            </div>
          </motion.div>

          {/* Image/Animation */}
          <motion.div
            {...imageAnimation}
            className="relative h-[400px] w-full"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-10"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              {imageLoading && !imageError && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-2xl"></div>
              )}
              {!imageError ? (
                <img
                  src="/your-profile-image.jpg"
                  alt="Sonalkumar Singh - Full Stack Developer"
                  className={`rounded-2xl object-cover shadow-2xl transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                  loading="eager"
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👨‍💻</div>
                    <p className="text-gray-600">Portfolio Image</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;