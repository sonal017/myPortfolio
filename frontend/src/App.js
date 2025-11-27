import React, { useEffect, useState, Suspense, lazy } from 'react';
import './App.css';
import Navbar from './components/navbar';

// Lazy load components for code splitting and better performance
const Header = lazy(() => import('./components/header'));
const About = lazy(() => import('./components/about'));
const Skills = lazy(() => import('./components/skill'));
const Projects = lazy(() => import('./components/project'));
const Contact = lazy(() => import('./components/contact'));

// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  // Theme state: 'light' or 'dark'. Persist in localStorage and sync to <html data-theme>
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    } catch (e) {
      /* ignore */
    }
  }, [theme]);

  // Reduce motion for accessibility
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => {
      if (e.matches) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
      } else {
        document.documentElement.removeAttribute('data-reduced-motion');
      }
    };
    
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="App">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="bg-gray-50">
        <section id="home">
          <Suspense fallback={<SectionLoader />}>
            <Header />
          </Suspense>
        </section>
        <section id="about" className="py-20">
          <Suspense fallback={<SectionLoader />}>
            <About />
          </Suspense>
        </section>
        <section id="skills" className="py-20 bg-white">
          <Suspense fallback={<SectionLoader />}>
            <Skills />
          </Suspense>
        </section>
        <section id="projects" className="py-20">
          <Suspense fallback={<SectionLoader />}>
            <Projects />
          </Suspense>
        </section>
        <section id="contact" className="py-20 bg-white">
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
        </section>
      </main>
    </div>
  );
}

export default App;
