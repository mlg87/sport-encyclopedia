import { describe, it, expect } from 'vitest';
import { SPORTS, COMING_SOON } from './registry';

describe('sports registry', () => {
  it('includes the big four North American leagues, both F1 championships, and EPL', () => {
    const ids = SPORTS.map((s) => s.id);
    expect(ids).toEqual(['nhl', 'nfl', 'nba', 'mlb', 'f1-drivers', 'f1-constructors', 'epl']);
  });

  it('assigns unique ids and routes', () => {
    const ids = SPORTS.map((s) => s.id);
    const routes = SPORTS.map((s) => s.route);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it('has no coming-soon entries left - all planned sports are live', () => {
    expect(COMING_SOON).toEqual([]);
  });
});
