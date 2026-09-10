import React, { useState, memo, useCallback } from 'react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import { Link } from 'react-scroll';

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
      label: 'GitHub',
      icon: <FaGithub className="h-5 w-5" />,
      url: 'https://github.com/sonal017',
    },
    {
      label: 'LinkedIn',
      icon: <FaLinkedin className="h-5 w-5" />,
      url: 'https://www.linkedin.com/in/sonalkumar-singh-a8b230294',
    },
    {
      label: 'Instagram',
      icon: <FaInstagram className="h-5 w-5" />,
      url: 'https://www.instagram.com/sonal_._singh_',
    },
  ];

  const ThemeIcon = theme === 'light' ? FiMoon : FiSun;
  const MenuIcon = isMenuOpen ? FiX : FiMenu;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="home"
            smooth
            duration={500}
            className="group flex cursor-pointer items-center gap-3"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src="/logo192.png"
              alt="Sonalkumar Singh logo"
              className="h-10 w-10 rounded-md bg-white object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-800"
            />
            <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
              Sonalkumar Singh
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                smooth
                duration={500}
                offset={-72}
                className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${link.label}`}
                className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                {link.icon}
              </a>
            ))}

            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              type="button"
            >
              <ThemeIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              type="button"
            >
              <ThemeIcon className="h-6 w-6" />
            </button>
            <button
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              className="rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              type="button"
            >
              <MenuIcon className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                smooth
                duration={500}
                offset={-72}
                className="block cursor-pointer rounded-md px-3 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${link.label}`}
                className="rounded-md bg-slate-100 p-3 text-slate-700 transition-colors hover:text-slate-950 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
