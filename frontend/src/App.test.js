import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import Contact from './components/contact';

beforeEach(() => {
  localStorage.clear();
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false, media: query, addEventListener: jest.fn(), removeEventListener: jest.fn(),
  }));
  HTMLDialogElement.prototype.showModal = jest.fn(function () { this.setAttribute('open', ''); });
  HTMLDialogElement.prototype.close = jest.fn(function () { this.removeAttribute('open'); });
});
afterEach(() => { jest.restoreAllMocks(); delete global.fetch; });

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

test('theme selection updates the document and persists', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  expect(localStorage.getItem('theme')).toBe('dark');
  fireEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }));
  expect(document.documentElement).toHaveAttribute('data-theme', 'light');
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
  await act(async () => finishRequest({ ok: true }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Close message confirmation' })).toHaveFocus();
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
