import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import App from './App';

describe('App', () => {
  it('renders the masthead with title and year range', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Stanley Cup Champions/i })).toBeInTheDocument();
    // Scope to the masthead range text specifically — the years also appear
    // as row labels throughout the ledger, so `getByText(/1893/)` is ambiguous.
    expect(screen.getByText(/1893\s*—\s*2025/)).toBeInTheDocument();
  });

  it('groups champions into decades', () => {
    render(<App />);
    // Each decade renders an h2 with its label (e.g. "1890s", "1900s", ...).
    expect(screen.getByRole('heading', { name: '1890s' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2020s' })).toBeInTheDocument();
  });

  it('renders both no-champion rows', () => {
    render(<App />);
    expect(screen.getByText(/No champion — influenza/)).toBeInTheDocument();
    expect(screen.getByText(/No champion — lockout/)).toBeInTheDocument();
  });

  it('renders a version link in the footer pointing at the changelog', () => {
    render(<App />);
    // __APP_VERSION__ is injected by Vite's `define` in vite.config.ts.
    // In the Vitest environment the define pipeline also resolves it, so the
    // link renders with a concrete version string.
    const link = screen.getByRole('link', { name: /^v/ });
    expect(link).toHaveAttribute('href', expect.stringContaining('CHANGELOG.md'));
  });

  describe('accessibility', () => {
    it('has no axe violations on initial render', async () => {
      const { container } = render(<App />);
      // Running axe on the full tree is slow but it's the realistic integration
      // check. Kept in its own `describe('accessibility', ...)` block so the
      // a11y-only CI job can pattern-match on the test name.
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
