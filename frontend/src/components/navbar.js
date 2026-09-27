import React, { useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiGithub, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';

const menuItems = [
  { name: 'Work', to: 'projects' },
  { name: 'About', to: 'about' },
  { name: 'Skills', to: 'skills' },
  { name: 'Contact', to: 'contact' },
];

export default function Navbar({ theme, toggleTheme, staticMode = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const menuButton = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    let frame;
    const updateSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sections = [...document.querySelectorAll('main > section')];
        const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        const current = atBottom ? sections[sections.length - 1] : sections.filter((section) => section.getBoundingClientRect().top <= 180).pop();
        setActiveSection(current?.id || 'home');
      });
    };
    updateSection();
    window.addEventListener('scroll', updateSection, { passive: true });
    window.addEventListener('resize', updateSection);
    return () => {
      window.removeEventListener('scroll', updateSection);
      window.removeEventListener('resize', updateSection);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setIsMenuOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onResize = (event) => { if (event.matches) setIsMenuOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    desktop.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      desktop.removeEventListener('change', onResize);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const handleBlur = (event) => {
    if (!isMenuOpen || event.currentTarget.contains(event.relatedTarget)) return;
    setIsMenuOpen(false);
    // The browser may have scrolled the next control behind the expanded header.
    const nextControl = event.relatedTarget;
    requestAnimationFrame(() => {
      if (!nextControl || nextControl !== document.activeElement || !navRef.current) return;
      if (nextControl.getBoundingClientRect().top < navRef.current.getBoundingClientRect().bottom + 12) {
        nextControl.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    });
  };
  const ThemeIcon = theme === 'light' ? FiMoon : FiSun;

  return (
    <nav className={'site-nav' + (staticMode ? ' static-site-nav' : '')} ref={navRef} onBlur={handleBlur} aria-label="Main navigation">
      <div className="page-width nav-inner">
        <a href="#home" className="brand" onClick={closeMenu} aria-label="Sonalkumar Singh, home">
          <img src="/brand-mark.png?v=ss-blue" alt="" width="44" height="44" />
          <span translate="no">Sonalkumar Singh</span>
        </a>
        <div className={'desktop-links' + (staticMode ? ' static-nav-links' : '')}>
          {menuItems.map((item) => <a key={item.to} href={'#' + item.to} aria-current={activeSection === item.to ? 'location' : undefined}>{item.name}</a>)}
        </div>
        {!staticMode && <div className="nav-actions">
          <a className="icon-button nav-github" href="https://github.com/sonal017" target="_blank" rel="noopener noreferrer" aria-label="Visit GitHub" data-tooltip="GitHub"><FiGithub aria-hidden="true" /></a>
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={'Switch to ' + (theme === 'light' ? 'dark' : 'light') + ' theme'} data-tooltip={(theme === 'light' ? 'Dark' : 'Light') + ' theme'}><ThemeIcon aria-hidden="true" /></button>
          <button ref={menuButton} className="icon-button menu-toggle" type="button" onClick={() => setIsMenuOpen((open) => !open)} aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isMenuOpen} aria-controls="mobile-navigation">{isMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}</button>
        </div>}
      </div>
      {isMenuOpen && <div id="mobile-navigation" className="mobile-navigation page-width">
        {menuItems.map((item) => <a key={item.to} href={'#' + item.to} onClick={closeMenu} aria-current={activeSection === item.to ? 'location' : undefined}>{item.name}<FiArrowUpRight aria-hidden="true" /></a>)}
        <a href="https://github.com/sonal017" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>GitHub<FiGithub aria-hidden="true" /></a>
      </div>}
    </nav>
  );
}
