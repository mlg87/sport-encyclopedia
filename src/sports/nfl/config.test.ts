import { describe, it, expect } from 'vitest';
import { nflConfig } from './config';

describe('nflConfig', () => {
  it('has the expected identifying fields', () => {
    expect(nflConfig.id).toBe('nfl');
    expect(nflConfig.route).toBe('/nfl');
    expect(nflConfig.name).toBe('NFL');
    expect(nflConfig.trophyName).toBe('Lombardi Trophy');
    expect(nflConfig.championshipName).toBe('Super Bowl');
    expect(nflConfig.firstYear).toBe(1966);
  });

  it('wires rows through to the Super Bowl dataset', () => {
    expect(nflConfig.rows.length).toBe(59);
    expect(nflConfig.rows[0]).toMatchObject({ year: 1966, name: 'Green Bay Packers' });
  });

  it('logoResolver returns the ESPN URL', () => {
    const urls = nflConfig.logoResolver({
      year: 2024,
      noChampion: false,
      name: 'Philadelphia Eagles',
      abbr: 'PHI',
      espnAbbr: 'phi',
      color: '#004C54',
      franchiseId: 'eagles',
    });
    expect(urls).toEqual(['https://a.espncdn.com/i/teamlogos/nfl/500/phi.png']);
  });

  it('logoResolver returns empty when espnAbbr is null', () => {
    const urls = nflConfig.logoResolver({
      year: 2000,
      noChampion: false,
      name: 'Hypothetical',
      abbr: 'HYP',
      espnAbbr: null,
      color: '#000',
      franchiseId: 'hypothetical',
    });
    expect(urls).toEqual([]);
  });
});
