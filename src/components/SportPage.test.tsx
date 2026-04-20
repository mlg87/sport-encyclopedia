import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SportPage } from './SportPage';
import { nhlConfig } from '../sports/nhl/config';

describe('SportPage', () => {
  it('renders the sport-specific masthead', () => {
    render(<SportPage sport={nhlConfig} />);
    expect(screen.getByRole('heading', { name: /Stanley Cup Champions/i })).toBeInTheDocument();
    expect(screen.getByText(/1893\s*—\s*2025/)).toBeInTheDocument();
  });

  it('groups rows into decades', () => {
    render(<SportPage sport={nhlConfig} />);
    expect(screen.getByRole('heading', { name: '1890s' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2020s' })).toBeInTheDocument();
  });

  it('renders no-champion rows', () => {
    render(<SportPage sport={nhlConfig} />);
    expect(screen.getByText(/No champion — influenza/)).toBeInTheDocument();
    expect(screen.getByText(/No champion — lockout/)).toBeInTheDocument();
  });
});
