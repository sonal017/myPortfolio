import React, { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import './App.css';
import Navbar from './components/navbar';
import Header from './components/header';
import Projects from './components/project';
import About from './components/about';
import Skills from './components/skill';
import Contact from './components/contact';

export default function App({ staticMode = false }) {
  const [theme, setTheme] = useState(() => {
    if (staticMode || typeof window === 'undefined') return 'light';
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (error) { /* Storage can be unavailable in private browsing. */ }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const pageColor = getComputedStyle(document.documentElement).getPropertyValue('--page').trim();
    if (pageColor) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', pageColor);
    try { localStorage.setItem('theme', theme); } catch (error) { /* Theme still works without persistence. */ }
  }, [theme]);

  return (
    <div className={'App' + (staticMode ? ' static-portfolio' : '')}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar staticMode={staticMode} theme={theme} toggleTheme={() => setTheme((value) => value === 'light' ? 'dark' : 'light')} />
      <main id="main-content" tabIndex="-1">
        <section id="home" aria-label="Introduction"><Header /></section>
        <section id="projects" className="section work-section" aria-labelledby="projects-heading"><Projects /></section>
        <section id="about" className="section section-tinted" aria-label="About and experience"><About /></section>
        <section id="skills" className="section" aria-label="Skills"><Skills /></section>
        <section id="contact" className="section section-tinted" aria-label="Contact"><Contact staticMode={staticMode} /></section>
      </main>
      <footer className="site-footer page-width"><p>Sonalkumar Singh <span>Full-stack developer</span></p><a href="#home" className="text-link">Back to top<FiArrowUp aria-hidden="true" /></a></footer>
    </div>
  );
}
