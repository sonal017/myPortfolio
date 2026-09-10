import React, { useState, memo, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FiCheckCircle,
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiX,
} from 'react-icons/fi';

const Contact = memo(() => {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus({ type: null, message: '' });

      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const endpoint = `${API_URL}/api/contact`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error((data && data.error) || `Failed to save message. Server returned status ${response.status}.`);
        }

        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been saved.',
        });
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } catch (error) {
        const message =
          error.message && error.message !== 'Failed to fetch'
            ? error.message
            : 'Could not connect to the contact server. Please email me directly for now.';

        setSubmitStatus({
          type: 'error',
          message,
        });

        window.setTimeout(() => {
          setSubmitStatus((current) => (current.type === 'error' ? { type: null, message: '' } : current));
        }, 5000);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData],
  );

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const contactInfo = [
    {
      icon: <FiMail className="h-6 w-6" />,
      label: 'Email',
      value: 'sonalsinghraj123@gmail.com',
      link: 'mailto:sonalsinghraj123@gmail.com',
    },
    {
      icon: <FiPhone className="h-6 w-6" />,
      label: 'Phone',
      value: '+91 9324390374',
      link: 'tel:+919324390374',
    },
    {
      icon: <FiMapPin className="h-6 w-6" />,
      label: 'Location',
      value: 'Mumbai, India',
      link: 'https://www.google.com/maps/place/Mumbai',
    },
  ];

  const socialLinks = [
    {
      icon: <FiGithub className="h-5 w-5" />,
      label: 'GitHub',
      link: 'https://github.com/sonal017',
    },
    {
      icon: <FiLinkedin className="h-5 w-5" />,
      label: 'LinkedIn',
      link: 'https://www.linkedin.com/in/sonalkumar-singh-a8b230294',
    },
    {
      icon: <FiInstagram className="h-5 w-5" />,
      label: 'Instagram',
      link: 'https://www.instagram.com/sonal_._singh_',
    },
  ];

  const fadeUp = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.5, ease: 'easeOut' },
      };

  const SuccessModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onClick={() => setSubmitStatus({ type: null, message: '' })}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setSubmitStatus({ type: null, message: '' })}
          className="absolute right-4 top-4 rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Close"
          type="button"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
          <FiCheckCircle className="h-9 w-9" />
        </div>

        <h3 className="mt-6 text-2xl font-bold text-slate-950 dark:text-white">Message received</h3>
        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
          Thanks for reaching out. I&apos;ll reply as soon as possible.
        </p>

        <button
          onClick={() => setSubmitStatus({ type: null, message: '' })}
          className="mt-6 w-full rounded-md bg-slate-950 px-4 py-3 font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          type="button"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );

  const inputClassName =
    'w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-950';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {submitStatus.type === 'success' && <SuccessModal />}

      <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
          Contact
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Let&apos;s build something useful.
        </h2>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
          Have a role, freelance project, or product idea? Send the details and I&apos;ll get back to you.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div {...fadeUp} className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white">Contact Details</h3>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
              I&apos;m open to full-stack opportunities, React projects, and collaboration on practical web applications.
            </p>

            <div className="mt-7 space-y-4">
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.link}
                  target={item.label === 'Location' ? '_blank' : undefined}
                  rel={item.label === 'Location' ? 'noopener noreferrer' : undefined}
                  className="flex gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-cyan-200 hover:bg-cyan-50 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-cyan-900 dark:hover:bg-cyan-950/30"
                >
                  <span className="text-cyan-600 dark:text-cyan-300">{item.icon}</span>
                  <span>
                    <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {item.label}
                    </span>
                    <span className="mt-1 block font-semibold text-slate-800 dark:text-slate-100">{item.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">Connect</h3>
            <div className="mt-5 flex gap-3">
              {socialLinks.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-400"
                  aria-label={`Visit my ${item.label} profile`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClassName}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block font-semibold text-slate-700 dark:text-slate-200">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={inputClassName}
                placeholder="Tell me about the project, role, or question..."
                required
              />
            </div>

            {submitStatus.message && submitStatus.type === 'error' && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
                {submitStatus.message}
              </div>
            )}

            <motion.button
              whileHover={shouldReduceMotion || isSubmitting ? {} : { y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/15 transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 ${
                isSubmitting ? 'cursor-not-allowed opacity-70' : ''
              }`}
            >
              <FiSend className="h-5 w-5" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
});

Contact.displayName = 'Contact';

export default Contact;
