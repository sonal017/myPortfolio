import React, { useEffect, useRef, useState } from 'react';
import { getContactEndpoint } from '../contactApi';
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
  const [showSpinner, setShowSpinner] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const formRef = useRef(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const doneButtonRef = useRef(null);
  const submitButtonRef = useRef(null);
  const requestRef = useRef(null);
  const mountedRef = useRef(true);
  const hasDraft = Object.values(formData).some((value) => value.length > 0);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; requestRef.current?.abort(); };
  }, []);

  useEffect(() => {
    if (!hasDraft || staticMode) return undefined;
    const protectDraft = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', protectDraft);
    return () => window.removeEventListener('beforeunload', protectDraft);
  }, [hasDraft, staticMode]);

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
    const values = Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, value.trim()]));
    const fieldErrors = {};
    if (!values.name) fieldErrors.name = 'Enter your name.';
    if (!values.email) fieldErrors.email = 'Enter your email address.';
    else if (formRef.current.elements.email.validity.typeMismatch) fieldErrors.email = 'Enter a valid email address.';
    if (!values.message) fieldErrors.message = 'Add a message about your role or project.';
    setErrors(fieldErrors);
    const firstError = Object.keys(fieldErrors)[0];
    if (firstError) {
      formRef.current.elements[firstError].focus();
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setIsSubmitting(true);
    setStatus(null);
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let spinnerStartedAt = 0;
    let outcome = 'error';
    const spinnerTimer = window.setTimeout(() => {
      if (!mountedRef.current) return;
      spinnerStartedAt = Date.now();
      setShowSpinner(true);
    }, 200);
    try {
      const response = await fetch(getContactEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        signal: controller.signal,
      });
      if (response.status === 429) {
        outcome = 'rate-limited';
      } else {
        if (!response.ok) throw new Error('Message was not accepted.');
        const result = await response.json();
        if (result.success !== true) throw new Error('Message was not saved.');
        outcome = 'success';
      }
    } catch (error) {
      outcome = 'error';
    } finally {
      window.clearTimeout(timeout);
      window.clearTimeout(spinnerTimer);
      // Once shown, keep the spinner visible briefly instead of flashing it away.
      const remaining = spinnerStartedAt ? Math.max(0, 400 - (Date.now() - spinnerStartedAt)) : 0;
      if (remaining) await new Promise((resolve) => window.setTimeout(resolve, remaining));
      requestRef.current = null;
      if (mountedRef.current) {
        if (outcome === 'success') setFormData({ name: '', email: '', message: '' });
        setStatus(outcome);
        setShowSpinner(false);
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
    setErrors((current) => { const next = { ...current }; delete next[name]; return next; });
    if (status === 'error' || status === 'rate-limited') setStatus(null);
  };
  const submitFromTextarea = (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form.requestSubmit();
    }
  };
  const handleDialogKeyDown = (event) => {
    if (event.key !== 'Tab') return;
    const first = closeButtonRef.current;
    const last = doneButtonRef.current;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <div className="page-width contact-layout">
      <div className="contact-intro">
        <h2>Have something in mind?</h2>
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
      {!staticMode && <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
        <h3>Send a message</h3>
        <div className="form-fields">
          <div><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" value={formData.name} onChange={handleChange} placeholder={'Your name\u2026'} required maxLength={100} readOnly={isSubmitting} aria-invalid={Boolean(errors.name)} aria-describedby="name-error" /><p id="name-error" className="field-error" aria-live="polite">{errors.name}</p></div>
          <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" spellCheck="false" value={formData.email} onChange={handleChange} placeholder="you@example.com" required maxLength={254} readOnly={isSubmitting} aria-invalid={Boolean(errors.email)} aria-describedby="email-error" /><p id="email-error" className="field-error" aria-live="polite">{errors.email}</p></div>
        </div>
        <div><label htmlFor="message">Message</label><textarea id="message" name="message" value={formData.message} onChange={handleChange} onKeyDown={submitFromTextarea} placeholder={'Tell me about the role or project\u2026'} rows={5} required maxLength={5000} readOnly={isSubmitting} aria-invalid={Boolean(errors.message)} aria-describedby="message-error" /><p id="message-error" className="field-error" aria-live="polite">{errors.message}</p></div>
        {status === 'error' && <p className="form-error" role="alert">Your message couldn't be sent. Please try again or <a href="mailto:sonalsinghraj123@gmail.com">email me directly</a>.</p>}
        {status === 'rate-limited' && <p className="form-error" role="alert">Too many attempts. Please wait 15 minutes or <a href="mailto:sonalsinghraj123@gmail.com">email me directly</a>. Your draft is still here.</p>}
        <div className="form-bottom">
          <p className="form-note">Prefer email? <a href="mailto:sonalsinghraj123@gmail.com">Write to me directly.</a></p>
          <button ref={submitButtonRef} className="button button-primary" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>{showSpinner ? <FiLoader className="loading-icon" aria-hidden="true" /> : <FiSend aria-hidden="true" />}Send message</button>
        </div>
        <span className="submission-status" role="status">{isSubmitting ? 'Sending your message\u2026' : ''}</span>
      </form>}
      {!staticMode && <dialog ref={modalRef} className="success-dialog" aria-labelledby="success-title" aria-describedby="success-description" onKeyDown={handleDialogKeyDown} onCancel={(event) => { event.preventDefault(); setStatus(null); }} onClick={(event) => { if (event.target === event.currentTarget) setStatus(null); }}>
        <button ref={closeButtonRef} type="button" className="icon-button dialog-close" aria-label="Close message confirmation" onClick={() => setStatus(null)}><FiX aria-hidden="true" /></button>
        <FiCheckCircle className="success-icon" aria-hidden="true" />
        <h3 id="success-title">Message received.</h3>
        <p id="success-description">Thanks for reaching out. I'll get back to you as soon as I can.</p>
        <button ref={doneButtonRef} type="button" className="button button-primary" onClick={() => setStatus(null)}>Done</button>
      </dialog>}
    </div>
  );
}
