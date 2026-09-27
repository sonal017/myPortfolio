import React from 'react';
import { FiArrowDownRight, FiDownload } from 'react-icons/fi';

export default function Header() {
  return (
    <div className="page-width intro">
      <div className="intro-topline">
        <p className="eyebrow intro-role">Full-stack developer</p>
        <p className="availability"><span aria-hidden="true" /> Available for opportunities</p>
      </div>
      <h1 translate="no">Sonalkumar Singh<span className="name-accent">.</span></h1>
      <p className="intro-description">
        I build React interfaces and dependable APIs, with 1+ years of hands-on product experience.
      </p>
      <div className="intro-bottom">
        <div className="button-row">
          <a href="#projects" className="button button-primary">View projects <FiArrowDownRight aria-hidden="true" /></a>
          <a href="/Sonalkumar_Singh_CV_2026.pdf" download className="button button-secondary resume-link"><FiDownload aria-hidden="true" /> Download CV</a>
        </div>
      </div>
    </div>
  );
}
