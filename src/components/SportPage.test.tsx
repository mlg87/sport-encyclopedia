import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SportPage } from './SportPage';
import { nhlConfig } from '../sports/nhl/config';

function renderSportPage() {
  return render(
    <MemoryRouter>
      <SportPage sport={nhlConfig} />
    </MemoryRouter>,
  );
}

describe('SportPage', () => {
  it('renders the sport-specific masthead', () => {
    renderSportPage();
    expect(screen.getByRole('heading', { name: /Stanley Cup Champions/i })).toBeInTheDocument();
    expect(screen.getByText(/1893\s*—\s*2025/)).toBeInTheDocument();
  });

  it('groups rows into decades', () => {
    renderSportPage();
    expect(screen.getByRole('heading', { name: '1890s' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2020s' })).toBeInTheDocument();
  });

  it('renders no-champion rows', () => {
    renderSportPage();
    expect(screen.getByText(/No champion — influenza/)).toBeInTheDocument();
    expect(screen.getByText(/No champion — lockout/)).toBeInTheDocument();
  });

  it('renders a back-to-hub link in the page nav', () => {
    renderSportPage();
    const link = screen.getByRole('link', { name: /all sports/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
