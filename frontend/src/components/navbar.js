import React, { useState, memo, useCallback } from 'react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FiMoon, FiSun } from 'react-icons/fi';
import { Link } from 'react-scroll';
import GradientText from './GradientText';

const Navbar = memo(({ theme = 'light', toggleTheme = () => {} }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const menuItems = [
    { name: 'Home', to: 'home' },
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'skills' },
    { name: 'Projects', to: 'projects' },
    { name: 'Contact', to: 'contact' },
  ];

  const socialLinks = [
    { 
      icon: <FaGithub className="w-6 h-6" />, 
      url: 'https://github.com/sonal017'
    },
    { 
      icon: <FaLinkedin className="w-6 h-6" />, 
      url: 'https://www.linkedin.com/in/sonalkumar-singh-a8b230294'
    },
    { 
      icon: <FaInstagram className="w-6 h-6" />, 
      url: 'https://www.instagram.com/sonal_._singh_'
    },
  ];

  // Show moon icon when current theme is light (so user can switch to night)
  // Show sun icon when current theme is dark (so user can switch to light)
  const ThemeIcon = theme === 'light' ? FiMoon : FiSun;

  return (
    <nav className="fixed w-full bg-white/80 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg z-50 border-b border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="home" smooth={true} duration={500} className="text-xl font-bold cursor-pointer">
              <GradientText
                colors={['#3b82f6', '#10b981', '#3b82f6']}
                animationSpeed={6}
                className="font-bold"
              >
                Sonallkumar Singh
              </GradientText>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  smooth={true}
                  duration={500}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links + Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
              >
                {link.icon}
              </a>
            ))}

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-md text-gray-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ThemeIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-md text-gray-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ThemeIcon className="w-5 h-5" />
            </button>

            <div>
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg
                  className={`h-6 w-6 ${isMenuOpen ? 'hidden' : 'block'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`h-6 w-6 ${isMenuOpen ? 'block' : 'hidden'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              smooth={true}
              duration={500}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="px-5 pt-4 pb-6 space-y-4">
          <div className="flex space-x-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;