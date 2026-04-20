import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import App from './App';

describe('App', () => {
  it('renders the home hub at /', () => {
    window.history.pushState({}, '', '/sport-encyclopedia/');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Sport Encyclopedia/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /NHL/i })).toBeInTheDocument();
  });

  it('renders the NHL page at /nhl', () => {
    window.history.pushState({}, '', '/sport-encyclopedia/nhl');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Stanley Cup Champions/i })).toBeInTheDocument();
    expect(screen.getByText(/1893\s*—\s*2025/)).toBeInTheDocument();
  });

  it('renders a version link in the footer on every route', () => {
    window.history.pushState({}, '', '/sport-encyclopedia/');
    render(<App />);
    const link = screen.getByRole('link', { name: /^v/ });
    expect(link).toHaveAttribute('href', expect.stringContaining('/releases'));
  });

  it('renders a not-found page for unknown routes', () => {
    window.history.pushState({}, '', '/sport-encyclopedia/nope');
    render(<App />);
    expect(screen.getByRole('heading', { name: /Not found/i })).toBeInTheDocument();
  });

  describe('accessibility', () => {
    it('home hub has no axe violations', async () => {
      window.history.pushState({}, '', '/sport-encyclopedia/');
      const { container } = render(<App />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('sport page has no axe violations', async () => {
      window.history.pushState({}, '', '/sport-encyclopedia/nhl');
      const { container } = render(<App />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
