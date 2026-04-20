import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import { HomeHub } from './HomeHub';
import { SPORTS, COMING_SOON } from '../sports/registry';

function renderHub() {
  return render(
    <MemoryRouter>
      <HomeHub sports={SPORTS} comingSoon={COMING_SOON} />
    </MemoryRouter>,
  );
}

describe('HomeHub', () => {
  it('renders an active tile for each registered sport as a link', () => {
    renderHub();
    for (const s of SPORTS) {
      const link = screen.getByRole('link', { name: new RegExp(s.name, 'i') });
      expect(link).toHaveAttribute('href', s.route);
    }
  });

  it('renders the most recent champion on each active tile', () => {
    renderHub();
    const nhlTile = screen.getByRole('link', { name: /NHL/i });
    expect(nhlTile).toHaveTextContent('Florida Panthers');
    expect(nhlTile).toHaveTextContent('2025');
  });

  it('renders inert tiles for each coming-soon league', () => {
    renderHub();
    for (const cs of COMING_SOON) {
      const tile = screen.getByText(cs.name).closest('.hub__tile');
      expect(tile).toBeTruthy();
      expect(tile?.tagName).not.toBe('A');
      expect(tile?.textContent).toMatch(/Coming soon/i);
    }
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = renderHub();
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
