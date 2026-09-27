process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';
require('react-scripts/config/env');
const { getContactEndpoint } = require('../src/contactApi');

try {
  getContactEndpoint();
} catch (error) {
  console.error(`Build configuration error: ${error.message}`);
  process.exit(1);
}
require('react-scripts/scripts/build');
