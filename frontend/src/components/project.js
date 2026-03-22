import React, { useState, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiExternalLink, FiGithub } from 'react-icons/fi';

const ProjectCard = memo(({ project, index }) => {
  const shouldReduceMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 }
      };

  return (
    <motion.div
      {...animationProps}
      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]"
      style={{ willChange: 'transform' }}
    >
      <div className="relative h-48 bg-gray-300 overflow-hidden">
        {imageLoading && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
        )}
        {!imageError ? (
          <img
            src={project.image}
            alt={`${project.title} project screenshot`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            loading="lazy"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <span className="text-gray-500 text-sm">Image unavailable</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 hover:opacity-100 flex items-center justify-center space-x-4">
          <a
            href={project.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full text-gray-900 hover:text-blue-600 transition-colors transform hover:scale-110"
            aria-label={`View live demo of ${project.title}`}
          >
            <FiExternalLink className="w-6 h-6" />
          </a>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white rounded-full text-gray-900 hover:text-blue-600 transition-colors transform hover:scale-110"
            aria-label={`View ${project.title} on GitHub`}
          >
            <FiGithub className="w-6 h-6" />
          </a>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {project.title}
        </h3>
        <p className="text-gray-600 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-full text-sm border border-gray-200 dark:border-slate-600"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

const Projects = () => {
  const shouldReduceMotion = useReducedMotion();
  
  const projects = [
    {
      title: 'Personal Portfolio Website',
      description: 'A modern, responsive portfolio website featuring dark/light theme toggle, interactive animations, glassmorphic design, and smooth scroll navigation. Built with React, Tailwind CSS, and Framer Motion for seamless interactions.',
      image: '/portfolio-preview.jpg',
      technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'Express'],
      liveDemo: 'https://sonalkumar-dev-portfolio.vercel.app',
      github: 'https://github.com/sonalkumar/portfolio'
    },
    {
      title: 'Full-Stack Contact Management System',
      description: 'A contact management application with backend API for storing and retrieving contact information. Features form validation, responsive design, and real-time data persistence with MongoDB.',
      image: '/contact-system.jpg',
      technologies: ['React', 'MongoDB', 'Express', 'Node.js', 'REST API'],
      liveDemo: 'https://contact-manager-demo.vercel.app',
      github: 'https://github.com/sonalkumar/contact-system'
    },
    {
      title: 'E-Commerce Product Showcase',
      description: 'An interactive product showcase with filtering, sorting, and dynamic cart functionality. Demonstrates modern React patterns including hooks, context API, and component composition.',
      image: '/ecommerce-shop.jpg',
      technologies: ['React', 'JavaScript', 'CSS3', 'Local Storage'],
      liveDemo: 'https://ecommerce-shop.vercel.app',
      github: 'https://github.com/sonalkumar/ecommerce'
    },
    {
      title: 'Weather Forecast Application',
      description: 'Real-time weather application with geolocation support, responsive design, and beautiful UI. Integrates with weather API to display current conditions and forecasts.',
      image: '/weather-app.jpg',
      technologies: ['React', 'API Integration', 'Geolocation API', 'Tailwind CSS'],
      liveDemo: 'https://weather-app.vercel.app',
      github: 'https://github.com/sonalkumar/weather-app'
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
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-300 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4"
        >
          Portfolio Showcase
        </motion.h2>
        <p className="text-lg text-gray-600">
          Explore my journey through projects, each representing unique challenges and solutions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};

export default memo(Projects);