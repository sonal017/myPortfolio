function getContactEndpoint(configuredUrl = process.env.REACT_APP_API_URL, mode = process.env.NODE_ENV) {
  const base = (configuredUrl || '').trim();
  // Same-origin hosting is opt-in: the deployment must proxy /api to the backend.
  if (base === '/') return '/api/contact';
  if (!base && mode !== 'production') return 'http://localhost:5000/api/contact';
  let url;
  try { url = new URL(base); } catch { throw new Error('Set REACT_APP_API_URL to your HTTPS backend origin, or / for a configured same-origin API proxy.'); }
  const host = url.hostname;
  const local = host === 'localhost' || host.endsWith('.localhost') || /^127\./.test(host) || host === '[::1]' || host === '0.0.0.0';
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash ||
      (mode === 'production' && (url.protocol !== 'https:' || local))) {
    throw new Error('Production REACT_APP_API_URL must use a non-local HTTPS URL without credentials, query, or hash.');
  }
  return `${url.href.replace(/\/$/, '')}/api/contact`;
}

module.exports = { getContactEndpoint };
