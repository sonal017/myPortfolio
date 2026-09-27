const { getContactEndpoint } = require('./contactApi');

test('development keeps the local API available', () => {
  expect(getContactEndpoint('', 'development')).toBe('http://localhost:5000/api/contact');
  expect(getContactEndpoint('http://localhost:5000/', 'development')).toBe('http://localhost:5000/api/contact');
});

test('production rejects missing, local, insecure and credential-bearing API URLs', () => {
  ['', 'http://api.example.test', 'http://localhost:5000', 'https://localhost',
    'https://test.localhost', 'https://127.0.0.1', 'https://[::1]', 'https://0.0.0.0',
    'https://user:pass@api.example.test', 'https://api.example.test?token=secret',
    'https://api.example.test#contact', 'javascript:alert(1)', '//api.example.test',
  ].forEach((url) => expect(() => getContactEndpoint(url, 'production')).toThrow());
});

test('HTTPS backend and explicit same-origin proxy have predictable endpoints', () => {
  expect(getContactEndpoint('https://api.example.test/', 'production')).toBe('https://api.example.test/api/contact');
  expect(getContactEndpoint('/', 'production')).toBe('/api/contact');
});
