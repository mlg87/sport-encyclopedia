import { describe, it, expect } from 'vitest';
import { mlbConfig } from './config';

describe('mlbConfig', () => {
  it('has the expected identifying fields', () => {
    expect(mlbConfig.id).toBe('mlb');
    expect(mlbConfig.route).toBe('/mlb');
    expect(mlbConfig.name).toBe('MLB');
    expect(mlbConfig.trophyName).toBe('Commissioner\u2019s Trophy');
    expect(mlbConfig.championshipName).toBe('World Series');
    expect(mlbConfig.firstYear).toBe(1903);
  });

  it('wires rows through to the World Series dataset', () => {
    // 123 entries: 121 champion rows + 2 noChampion rows (1904 Giants
    // refusal, 1994 players' strike) covering 1903-2025 inclusive.
    expect(mlbConfig.rows.length).toBe(123);
    expect(mlbConfig.rows[0]).toMatchObject({ year: 1903, name: 'Boston Americans' });
  });

  it('records the 1904 noChampion row with the Giants-refusal reason', () => {
    const row1904 = mlbConfig.rows.find((r) => r.year === 1904);
    expect(row1904).toBeDefined();
    expect(row1904?.noChampion).toBe(true);
    if (row1904 && row1904.noChampion) {
      expect(row1904.reason).toBe('NL champion Giants refused to play');
    }
  });

  it('records the 1994 noChampion row with the players\u2019 strike reason', () => {
    const row1994 = mlbConfig.rows.find((r) => r.year === 1994);
    expect(row1994).toBeDefined();
    expect(row1994?.noChampion).toBe(true);
    if (row1994 && row1994.noChampion) {
      expect(row1994.reason).toBe('players\u2019 strike');
    }
  });

  it('logoResolver returns the ESPN URL for a current-team row', () => {
    const urls = mlbConfig.logoResolver({
      year: 2024,
      noChampion: false,
      name: 'Los Angeles Dodgers',
      abbr: 'LAD',
      espnAbbr: 'lad',
      color: '#005A9C',
      franchiseId: 'dodgers',
    });
    expect(urls).toEqual(['https://a.espncdn.com/i/teamlogos/mlb/500/lad.png']);
  });

  it('logoResolver returns empty when espnAbbr is null', () => {
    const urls = mlbConfig.logoResolver({
      year: 1900,
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
