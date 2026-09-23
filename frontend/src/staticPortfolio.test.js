import { render, screen, within } from '@testing-library/react';
import App from './App';

const fs = require('fs');
const path = require('path');

test('static mode retains the portfolio without JavaScript-only controls', () => {
  render(<App staticMode />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sonalkumar Singh');
  expect(screen.getAllByRole('img', { name: /website screenshot/ })).toHaveLength(6);
  const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
  ['Work', 'About', 'Skills', 'Contact'].forEach((name) => {
    expect(within(navigation).getByRole('link', { name })).toBeInTheDocument();
  });
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Email sonalsinghraj123/ })).toHaveAttribute('href', 'mailto:sonalsinghraj123@gmail.com');
});

test('generated HTML includes complete no-script content and existing local assets', () => {
  const publicDirectory = path.join(__dirname, '../public');
  const template = fs.readFileSync(path.join(publicDirectory, 'index.html'), 'utf8');
  const page = new DOMParser().parseFromString(template, 'text/html');
  expect(template).not.toContain('You need to enable JavaScript');
  expect(page.querySelectorAll('main')).toHaveLength(1);
  expect(page.querySelectorAll('.project-card')).toHaveLength(6);
  expect([...page.querySelectorAll('main > section')].map((section) => section.id)).toEqual(['home', 'projects', 'about', 'skills', 'contact']);
  expect(page.querySelector('form')).toBeNull();
  expect(page.querySelector('button')).toBeNull();
  expect(page.querySelector('noscript link[rel="stylesheet"]').getAttribute('href')).toBe('%PUBLIC_URL%/static-portfolio.css');
  expect(fs.statSync(path.join(publicDirectory, 'static-portfolio.css')).size).toBeGreaterThan(1000);
  page.querySelectorAll('a[href^="#"]').forEach((link) => {
    expect(page.getElementById(link.getAttribute('href').slice(1))).not.toBeNull();
  });
  page.querySelectorAll('img[src^="/"], a[download]').forEach((element) => {
    const asset = (element.getAttribute('src') || element.getAttribute('href')).split('?')[0];
    expect(fs.existsSync(path.join(publicDirectory, asset))).toBe(true);
  });
  ['SlotMate', 'Ezhog', 'CreateReceipt', 'DulyPlan'].forEach((title) => {
    const project = [...page.querySelectorAll('.project-card')].find((card) => card.querySelector('h3').textContent === title);
    expect(project.querySelector('a[href*="github.com"]')).toBeNull();
  });
});
