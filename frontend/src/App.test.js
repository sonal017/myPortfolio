import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import Contact from './components/contact';

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  document.documentElement.style.removeProperty('--page');
  HTMLElement.prototype.scrollIntoView = jest.fn();
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false, media: query, addEventListener: jest.fn(), removeEventListener: jest.fn(),
  }));
  HTMLDialogElement.prototype.showModal = jest.fn(function () { this.setAttribute('open', ''); });
  HTMLDialogElement.prototype.close = jest.fn(function () { this.removeAttribute('open'); });
});
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); delete global.fetch; });

test('puts real projects immediately after the introduction and retains the updated CV', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sonalkumar Singh');
  const sections = [...document.querySelectorAll('main > section')].map((section) => section.id);
  expect(sections).toEqual(['home', 'projects', 'about', 'skills', 'contact']);
  expect(screen.getAllByRole('img', { name: /website screenshot/ })).toHaveLength(6);
  screen.getAllByRole('link', { name: 'Download CV' }).forEach((link) => {
    expect(link).toHaveAttribute('href', '/Sonalkumar_Singh_CV_2026.pdf');
    expect(link).toHaveAttribute('download');
  });
  ['SlotMate', 'Ezhog', 'CreateReceipt', 'DulyPlan'].forEach((title) => {
    const card = screen.getByRole('heading', { name: title }).closest('article');
    expect(within(card).getByText('Company project')).toBeInTheDocument();
    expect(within(card).queryByRole('link', { name: /Source code/ })).not.toBeInTheDocument();
  });
  expect(screen.getByRole('link', { name: 'Source code: Stack Overflow Clone' })).toHaveAttribute('href', 'https://github.com/sonal017/codequest');
});

test('mobile navigation supports Escape, focus return, and selection', () => {
  render(<App />);
  const menuButton = screen.getByRole('button', { name: 'Open navigation menu' });
  fireEvent.click(menuButton);
  expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(menuButton).toHaveFocus();
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(menuButton);
  fireEvent.click(within(document.getElementById('mobile-navigation')).getByRole('link', { name: 'Work' }));
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
});

test('mobile navigation closes when keyboard focus moves into the page', () => {
  render(<App />);
  const menuButton = screen.getByRole('button', { name: 'Open navigation menu' });
  fireEvent.click(menuButton);
  const lastLink = within(document.getElementById('mobile-navigation')).getByRole('link', { name: 'GitHub' });
  act(() => lastLink.focus());
  const nextLink = screen.getByRole('link', { name: 'View projects' });
  act(() => nextLink.focus());
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  expect(nextLink).toHaveFocus();
});

test('worked projects use one consistent grid without filters or featured rows', () => {
  render(<App />);
  const section = screen.getByRole('region', { name: 'Worked Projects' });
  expect(within(section).getByRole('heading', { level: 2, name: 'Worked Projects' })).toBeInTheDocument();
  expect(within(section).queryByRole('button')).not.toBeInTheDocument();
  expect(within(section).queryByRole('status')).not.toBeInTheDocument();
  expect(document.getElementById('project-list')).toHaveClass('project-grid');
  const cards = within(section).getAllByRole('article');
  expect(cards).toHaveLength(6);
  cards.forEach((card) => expect(card).toHaveClass('project-card', { exact: true }));
  expect(section.querySelector('.work-count')).toHaveTextContent('6');
});

test('theme selection updates the document and persists', () => {
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  document.head.appendChild(meta);
  document.documentElement.style.setProperty('--page', '#ffffff');
  render(<App />);
  expect(meta.content).toBe('#ffffff');
  document.documentElement.style.setProperty('--page', '#161719');
  fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(localStorage.getItem('theme')).toBe('dark');
  expect(meta.content).toBe('#161719');
  fireEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }));
  expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  meta.remove();
});

test('legacy filter URLs no longer hide projects or change other URL state', () => {
  window.history.replaceState(null, '', '/?ref=profile&work=independent#projects');
  const { unmount } = render(<App />);
  expect(document.querySelectorAll('.project-card')).toHaveLength(6);
  expect(screen.queryByRole('group', { name: 'Filter projects' })).not.toBeInTheDocument();
  expect(window.location.search).toBe('?ref=profile&work=independent');
  expect(window.location.hash).toBe('#projects');
  unmount();
  window.history.replaceState(null, '', '/?ref=profile&work=company#projects');
  render(<App />);
  expect(document.querySelectorAll('.project-card')).toHaveLength(6);
  expect(window.location.search).toBe('?ref=profile&work=company');
});

function fillContact() {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'UI Test' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ui-test@example.com' } });
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Testing the local contact interface.' } });
}

test('contact prevents duplicate submissions and returns focus after confirmation', async () => {
  let finishRequest;
  global.fetch = jest.fn(() => new Promise((resolve) => { finishRequest = resolve; }));
  render(<Contact />);
  fillContact();
  const submit = screen.getByRole('button', { name: 'Send message' });
  fireEvent.click(submit);
  expect(submit).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('Sending');
  fireEvent.submit(submit.closest('form'));
  expect(fetch).toHaveBeenCalledTimes(1);
  await act(async () => finishRequest({ ok: true, json: async () => ({ success: true }) }));
  expect(await screen.findByRole('dialog')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Close message confirmation' })).toHaveFocus();
  const close = screen.getByRole('button', { name: 'Close message confirmation' });
  const done = screen.getByRole('button', { name: 'Done' });
  fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
  expect(done).toHaveFocus();
  fireEvent.keyDown(done, { key: 'Tab' });
  expect(close).toHaveFocus();
  expect(screen.getByLabelText('Name')).toHaveValue('');
  fireEvent.click(screen.getByRole('button', { name: 'Done' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(submit).toHaveFocus();
  expect(document.body.style.overflow).not.toBe('hidden');
});

test('failed contact requests preserve the message and offer email recovery', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false });
  render(<Contact />);
  fillContact();
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  const alert = await screen.findByRole('alert');
  expect(within(alert).getByRole('link', { name: 'email me directly' })).toHaveAttribute('href', 'mailto:sonalsinghraj123@gmail.com');
  expect(screen.getByLabelText('Message')).toHaveValue('Testing the local contact interface.');
  await waitFor(() => expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled());
});

test('rate-limited contact requests explain the delay and preserve the draft', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 429 });
  render(<Contact />);
  fillContact();
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Please wait 15 minutes');
  expect(screen.getByLabelText('Message')).toHaveValue('Testing the local contact interface.');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test.each([
  { ok: true, json: async () => ({ success: false }) },
  { ok: true, json: async () => ({}) },
  { ok: true, json: async () => { throw new Error('HTML response from an incorrect API proxy'); } },
])('HTTP 200 without a confirmed JSON save is not treated as success (%#)', async (response) => {
  global.fetch = jest.fn().mockResolvedValue(response);
  render(<Contact />);
  fillContact();
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(await screen.findByRole('alert')).toHaveTextContent("Your message couldn't be sent");
  expect(screen.getByLabelText('Message')).toHaveValue('Testing the local contact interface.');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('contact validation rejects whitespace and malformed email and focuses the first error', () => {
  global.fetch = jest.fn();
  render(<Contact />);
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: '   ' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } });
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: '   ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(fetch).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Name')).toHaveFocus();
  expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByLabelText('Name')).toHaveAccessibleDescription('Enter your name.');
  expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Enter a valid email address.');
  expect(screen.getByLabelText('Message')).toHaveAccessibleDescription('Add a message about your role or project.');
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'UI Test' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(screen.getByLabelText('Email')).toHaveFocus();
});

test('contact trims submitted values while preserving the draft on failure', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false });
  render(<Contact />);
  fillContact();
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: ' UI Test ' } });
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: ' A project enquiry. ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  await screen.findByRole('alert');
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ name: 'UI Test', email: 'ui-test@example.com', message: 'A project enquiry.' });
  expect(screen.getByLabelText('Message')).toHaveValue(' A project enquiry. ');
});

test('unsent drafts enable a navigation warning without storing contact details', () => {
  render(<Contact />);
  const clean = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(clean);
  expect(clean.defaultPrevented).toBe(false);
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Unsent draft' } });
  const dirty = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(dirty);
  expect(dirty.defaultPrevented).toBe(true);
  expect(localStorage.length).toBe(0);
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: '' } });
  const cleared = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(cleared);
  expect(cleared.defaultPrevented).toBe(false);
});

test('textarea supports Ctrl/Cmd+Enter without swallowing ordinary newlines', () => {
  const requestSubmit = jest.spyOn(HTMLFormElement.prototype, 'requestSubmit').mockImplementation(() => {});
  render(<Contact />);
  const textarea = screen.getByLabelText('Message');
  fireEvent.keyDown(textarea, { key: 'Enter' });
  expect(requestSubmit).not.toHaveBeenCalled();
  fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
  fireEvent.keyDown(textarea, { key: 'Enter', metaKey: true });
  expect(requestSubmit).toHaveBeenCalledTimes(2);
});

test('submission keeps its label and avoids spinner flicker', async () => {
  jest.useFakeTimers();
  let finishRequest;
  global.fetch = jest.fn(() => new Promise((resolve) => { finishRequest = resolve; }));
  render(<Contact />);
  fillContact();
  const submit = screen.getByRole('button', { name: 'Send message' });
  fireEvent.click(submit);
  expect(document.querySelector('.loading-icon')).toBeNull();
  act(() => jest.advanceTimersByTime(200));
  expect(document.querySelector('.loading-icon')).not.toBeNull();
  expect(submit).toHaveTextContent('Send message');
  expect(screen.getByLabelText('Message')).toHaveAttribute('readonly');
  await act(async () => finishRequest({ ok: true, json: async () => ({ success: true }) }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  await act(async () => jest.advanceTimersByTime(399));
  expect(submit).toBeDisabled();
  await act(async () => jest.advanceTimersByTime(1));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(submit).toBeEnabled();
});
