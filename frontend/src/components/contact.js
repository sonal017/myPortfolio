import React, { useState, memo, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiMail, FiPhone, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';

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
      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: '' });
      }, 5000);
    }
  }, [formData]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
