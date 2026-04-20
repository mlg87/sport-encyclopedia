import { describe, it, expect } from 'vitest';
import { SPORTS, COMING_SOON } from './registry';

describe('sports registry', () => {
  it('includes NHL, NFL, NBA, and MLB as active sports', () => {
    const ids = SPORTS.map((s) => s.id);
    expect(ids).toEqual(['nhl', 'nfl', 'nba', 'mlb']);
  });

  it('assigns unique ids and routes', () => {
    const ids = SPORTS.map((s) => s.id);
    const routes = SPORTS.map((s) => s.route);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it('lists the three deferred leagues as coming soon', () => {
    expect(COMING_SOON).toEqual([
      { id: 'f1-drivers', name: 'F1 Drivers', championshipName: 'Drivers\u2019 Championship' },
      {
        id: 'f1-constructors',
        name: 'F1 Constructors',
        championshipName: 'Constructors\u2019 Championship',
      },
      { id: 'epl', name: 'English top flight', championshipName: 'League title' },
    ]);
  });
});
