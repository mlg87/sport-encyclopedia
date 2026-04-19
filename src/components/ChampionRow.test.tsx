import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ChampionRow } from './ChampionRow';
import type { Champion } from '../data';

const win: Champion = {
  year: 1993,
  noChampion: false,
  name: 'Montreal Canadiens',
  abbr: 'MTL',
  espnAbbr: 'mtl',
  color: '#AF1E2D',
  franchiseId: 'canadiens',
};

const empty: Champion = {
  year: 1919,
  noChampion: true,
  reason: 'influenza',
};

describe('ChampionRow', () => {
  it('renders year, team name, and logo alt text for a champion', () => {
    render(<ChampionRow champion={win} cupCount={24} index={0} />);
    expect(screen.getByText('1993')).toBeInTheDocument();
    expect(screen.getByText('Montreal Canadiens')).toBeInTheDocument();
    expect(screen.getByAltText('Montreal Canadiens logo')).toBeInTheDocument();
  });

  it('collapses trophy icons to "×N" once the count exceeds five', () => {
    render(<ChampionRow champion={win} cupCount={24} index={0} />);
    expect(screen.getByText('×24')).toBeInTheDocument();
  });

  it('renders individual trophy icons when the count is ≤ five', () => {
    const { container } = render(<ChampionRow champion={win} cupCount={3} index={0} />);
    expect(container.querySelectorAll('.row__trophies svg')).toHaveLength(3);
    expect(screen.queryByText(/×/)).not.toBeInTheDocument();
  });

  it('renders a no-champion row with the reason in muted italic text', () => {
    render(<ChampionRow champion={empty} cupCount={0} index={0} />);
    expect(screen.getByText('1919')).toBeInTheDocument();
    expect(screen.getByText(/No champion — influenza/)).toBeInTheDocument();
  });

  describe('accessibility', () => {
    it('has no axe violations for a standard champion row', async () => {
      const { container } = render(<ChampionRow champion={win} cupCount={5} index={0} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations for a no-champion row', async () => {
      const { container } = render(<ChampionRow champion={empty} cupCount={0} index={0} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
