import React from 'react';
import { FiArrowUpRight, FiBriefcase, FiDownload } from 'react-icons/fi';

export default function About() {
  return (
    <div className="page-width about-layout">
      <div className="about-intro">
        <p className="eyebrow">About me</p>
        <h2>From interface to API.</h2>
        <p>I'm a full-stack developer based in Mumbai. I enjoy turning complex workflows into interfaces that feel straightforward to use.</p>
        <p>My work spans booking, AI tools, social scheduling, and document generation. I care about the details on both sides of the screen: clear interactions and dependable APIs.</p>
        <dl className="profile-facts"><div><dt>Experience</dt><dd>1+ years</dd></div><div><dt>Based in</dt><dd>Mumbai, India</dd></div></dl>
        <a href="/Sonalkumar_Singh_CV_2026.pdf" download className="text-link"><FiDownload aria-hidden="true" />Download CV</a>
      </div>
      <div className="experience-column">
        <article className="experience-entry">
          <div className="entry-heading"><span className="entry-icon"><FiBriefcase aria-hidden="true" /></span><p className="eyebrow">Experience</p></div>
          <div className="job-heading"><h3>Full Stack Developer</h3><span className="current-marker">Current</span></div>
          <p className="job-company">Digitrix Agency <span>Vasai, India</span></p>
          <p className="entry-date">Jun 2025 - Present</p>
          <p>Building product features across <strong>SlotMate</strong>, <strong>Ezhog</strong>, <strong>CreateReceipt</strong>, and <strong>DulyPlan</strong>.</p>
          <ul className="experience-points">
            <li>React interfaces, reusable components, and accessible product flows.</li>
            <li>Booking, timezone-aware scheduling, and document generation.</li>
            <li>Node.js APIs, asynchronous integrations, and backend workflows.</li>
          </ul>
          <a href="#projects" className="text-link">See the work<FiArrowUpRight aria-hidden="true" /></a>
        </article>
        <div className="education-block">
          <p className="eyebrow">Education</p>
          <h3>Bachelor of Information Technology</h3>
          <p>Mumbai University <span className="entry-date">2021 - 2024</span></p>
          <details className="education-details">
            <summary>Earlier education</summary>
            <div><p><strong>HSC Science</strong> / Vartak College</p><p className="entry-date">2020 - 2021 / 91.83%</p></div>
            <div><p><strong>SSC</strong> / Pancham High School</p><p className="entry-date">2018 - 2019 / 90.20%</p></div>
          </details>
        </div>
      </div>
    </div>
  );
}
