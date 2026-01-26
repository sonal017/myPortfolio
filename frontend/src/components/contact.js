import React, { useState, memo, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiMail, FiPhone, FiGithub, FiLinkedin, FiInstagram, FiCheckCircle, FiX } from 'react-icons/fi';

const Contact = memo(() => {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Use environment variable or fallback to localhost for development
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const endpoint = `${API_URL}/api/contact`;

      console.log('📤 Sending request to:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Expect JSON response with inserted record info
      const data = await response.json().catch(() => null);

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been saved.',
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: '',
        });
        // Don't auto-clear success on modal — user closes it
      } else {
        setSubmitStatus({
          type: 'error',
          message: (data && data.error) || `Failed to save message. Server returned status ${response.status}.`,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      let errorMessage = 'Network error. ';
      
      if (error.message.includes('fetch')) {
        errorMessage += 'Could not connect to server. Make sure the backend server is running on port 5000.';
      } else {
        errorMessage += error.message || 'Please try again later.';
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
      // Clear error status message after 5 seconds (not success — modal handles that)
      if (submitStatus.type === 'error') {
        setTimeout(() => {
          setSubmitStatus({ type: null, message: '' });
        }, 5000);
      }
    }
  }, [formData, submitStatus]);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const contactInfo = [
    {
      icon: <FiMail className="w-6 h-6" />,
      label: 'Email',
      value: 'sonalsinghraj123@gmail.com',
      link: 'mailto:sonalsinghraj123@gmail.com'
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      label: 'Phone',
      value: '+91 9324390374',
      link: 'tel:+919324390374'
    }
  ];

  const socialLinks = [
    {
      icon: <FiGithub className="w-6 h-6" />,
      label: 'GitHub',
      link: 'https://github.com/sonal017'
    },
    {
      icon: <FiLinkedin className="w-6 h-6" />,
      label: 'LinkedIn',
      link: 'https://www.linkedin.com/in/sonalkumar-singh-a8b230294'
    },
    {
      icon: <FiInstagram className="w-6 h-6" />,
      label: 'Instagram',
      link: 'https://www.instagram.com/sonal_._singh_'
    }
  ];

  const titleAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      };

  const leftAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: -20 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.5 }
      };

  const rightAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 20 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.5 }
      };

  // Success Modal Component
  const SuccessModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={() => setSubmitStatus({ type: null, message: '' })}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-md w-full p-8 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSubmitStatus({ type: null, message: '' })}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Check Circle Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 25 }}
          className="flex justify-center mb-6"
        >
          <FiCheckCircle className="w-16 h-16 text-green-500" />
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
        >
          Thank you for reaching out!
        </motion.h3>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed"
        >
          I've received your message and will get back to you as soon as possible.
        </motion.p>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-500 dark:text-slate-400 mb-6"
        >
          In the meantime, feel free to reach out via email or any of my social links.
        </motion.p>

        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          onClick={() => setSubmitStatus({ type: null, message: '' })}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
        >
          Great!
        </motion.button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Success Modal - only render when success */}
      {submitStatus.type === 'success' && <SuccessModal />}

      <div className="text-center mb-16">
        <motion.h2
          {...titleAnimation}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
        >
          Contact Me
        </motion.h2>
        <p className="text-lg text-gray-600">
          Got a question? Send me a message, and I'll get back to you soon.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div
          {...leftAnimation}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 dark:text-slate-300 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-slate-300 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 dark:text-slate-300 font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
              />
            </div>
            {submitStatus.message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  submitStatus.type === 'success'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {submitStatus.message}
              </div>
            )}
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: isSubmitting ? 1 : 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              style={{ willChange: 'transform' }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </form>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          {...rightAnimation}
          className="space-y-8"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h3>
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.link}
                  className="flex items-center space-x-4 text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <div className="text-blue-600">{item.icon}</div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p>{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Connect With Me</h3>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                  className="p-3 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors transform"
                  style={{ willChange: 'transform' }}
                  aria-label={`Visit my ${item.label} profile`}
                >
                  {item.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

Contact.displayName = 'Contact';

export default Contact;
