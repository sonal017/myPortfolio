import React, { useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiCheckCircle, FiGithub, FiInstagram, FiLinkedin, FiLoader, FiMail, FiMapPin, FiPhone, FiSend, FiX } from 'react-icons/fi';

const contactInfo = [
  { Icon: FiMail, label: 'Email', value: 'sonalsinghraj123@gmail.com', link: 'mailto:sonalsinghraj123@gmail.com' },
  { Icon: FiPhone, label: 'Phone', value: '+91 9324390374', link: 'tel:+919324390374' },
  { Icon: FiMapPin, label: 'Location', value: 'Mumbai, India', link: 'https://www.google.com/maps/place/Mumbai' },
];
const socialLinks = [
  { Icon: FiGithub, label: 'GitHub', link: 'https://github.com/sonal017' },
  { Icon: FiLinkedin, label: 'LinkedIn', link: 'https://www.linkedin.com/in/sonalkumar-singh-a8b230294' },
  { Icon: FiInstagram, label: 'Instagram', link: 'https://www.instagram.com/sonal_._singh_' },
];

export default function Contact({ staticMode = false }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const submitButtonRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    if (status !== 'success') return undefined;
    const dialog = modalRef.current;
    const submitButton = submitButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      submitButton?.focus();
    };
  }, [status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setIsSubmitting(true);
    setStatus(null);
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(baseUrl + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Message was not accepted.');
      setFormData({ name: '', email: '', message: '' });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
      requestRef.current = null;
      setIsSubmitting(false);
    }
  };

  const handleChange = (event) => setFormData((data) => ({ ...data, [event.target.name]: event.target.value }));

  return (
    <div className="page-width contact-layout">
      <div className="contact-intro">
        <p className="eyebrow">04 / Get in touch</p>
        <h2>Have something<br />in mind?</h2>
        <p>I'm open to full-stack roles, freelance projects, and good conversations about building for the web.</p>
        <div className="contact-details">
          {contactInfo.map(({ Icon, label, value, link }) => (
            <a key={label} href={link} className="contact-detail" target={label === 'Location' ? '_blank' : undefined} rel={label === 'Location' ? 'noopener noreferrer' : undefined}>
              <Icon aria-hidden="true" /><span><span className="detail-label">{label}</span><span className="detail-value">{value}</span></span><FiArrowUpRight className="detail-arrow" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="social-links">
          {socialLinks.map(({ Icon, label, link }) => <a key={label} href={link} target="_blank" rel="noopener noreferrer" className="icon-button" aria-label={'Visit ' + label} data-tooltip={label}><Icon aria-hidden="true" /></a>)}
        </div>
      </div>
      {!staticMode && <form className="contact-form" onSubmit={handleSubmit}>
        <h3>Send a message</h3>
        <div className="form-fields">
          <div><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" value={formData.name} onChange={handleChange} placeholder="Your name" required maxLength={100} /></div>
          <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" spellCheck="false" value={formData.email} onChange={handleChange} placeholder="you@example.com" required maxLength={254} /></div>
        </div>
        <div><label htmlFor="message">Message</label><textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about the role or project..." rows={5} required maxLength={5000} /></div>
        {status === 'error' && <p className="form-error" role="alert">Your message couldn't be sent. Please try again or <a href="mailto:sonalsinghraj123@gmail.com">email me directly</a>.</p>}
        <div className="form-bottom">
          <p className="form-note">Prefer email? <a href="mailto:sonalsinghraj123@gmail.com">Write to me directly.</a></p>
          <button ref={submitButtonRef} className="button button-primary" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>{isSubmitting ? <FiLoader className="loading-icon" aria-hidden="true" /> : <FiSend aria-hidden="true" />}{isSubmitting ? 'Sending\u2026' : 'Send message'}</button>
        </div>
        <span className="sr-only" role="status">{isSubmitting ? 'Sending your message.' : ''}</span>
      </form>}
      {!staticMode && <dialog ref={modalRef} className="success-dialog" aria-labelledby="success-title" aria-describedby="success-description" onCancel={(event) => { event.preventDefault(); setStatus(null); }} onClick={(event) => { if (event.target === event.currentTarget) setStatus(null); }}>
        <button ref={closeButtonRef} type="button" className="icon-button dialog-close" aria-label="Close message confirmation" onClick={() => setStatus(null)}><FiX aria-hidden="true" /></button>
        <FiCheckCircle className="success-icon" aria-hidden="true" />
        <h3 id="success-title">Message received.</h3>
        <p id="success-description">Thanks for reaching out. I'll get back to you as soon as I can.</p>
        <button type="button" className="button button-primary" onClick={() => setStatus(null)}>Done</button>
      </dialog>}
    </div>
  );
}
