import React from 'react';
import { FiArrowDownRight, FiCode, FiDownload, FiMapPin } from 'react-icons/fi';

export default function Header() {
  return (
    <div className="page-width intro">
      <div className="intro-topline">
        <p className="eyebrow intro-role"><FiCode aria-hidden="true" /> Full-stack developer</p>
        <p className="availability"><span aria-hidden="true" /> Available for opportunities</p>
      </div>
      <h1>Sonalkumar <span className="name-accent">Singh.</span></h1>
      <p className="intro-description">
        I build useful web products, from thoughtful React interfaces to the APIs behind them.
      </p>
      <div className="intro-bottom">
        <div className="button-row">
          <a href="#projects" className="button button-primary">View projects <FiArrowDownRight aria-hidden="true" /></a>
          <a href="/Sonalkumar_Singh_CV_2026.pdf" download className="button button-secondary"><FiDownload aria-hidden="true" /> Download CV</a>
        </div>
        <p className="intro-meta"><span><FiMapPin aria-hidden="true" /> Mumbai, India</span><span>1+ years of experience</span></p>
      </div>
    </div>
  );
}
