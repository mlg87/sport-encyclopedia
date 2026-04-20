import { describe, it, expect } from 'vitest';
import { nbaConfig } from './config';

describe('nbaConfig', () => {
  it('has the expected identifying fields', () => {
    expect(nbaConfig.id).toBe('nba');
    expect(nbaConfig.route).toBe('/nba');
    expect(nbaConfig.name).toBe('NBA');
    expect(nbaConfig.trophyName).toBe('Larry O\u2019Brien Trophy');
    expect(nbaConfig.championshipName).toBe('NBA Finals');
    expect(nbaConfig.firstYear).toBe(1947);
  });

  it('wires rows through to the NBA Finals dataset', () => {
    // 78 Finals from 1946-47 (year 1947) through 2023-24 (year 2024).
    expect(nbaConfig.rows.length).toBe(78);
    expect(nbaConfig.rows[0]).toMatchObject({ year: 1947, name: 'Philadelphia Warriors' });
  });

  it('logoResolver returns the ESPN URL', () => {
    const urls = nbaConfig.logoResolver({
      year: 2024,
      noChampion: false,
      name: 'Boston Celtics',
      abbr: 'BOS',
      espnAbbr: 'bos',
      color: '#007A33',
      franchiseId: 'celtics',
    });
    expect(urls).toEqual(['https://a.espncdn.com/i/teamlogos/nba/500/bos.png']);
  });

  it('logoResolver returns empty when espnAbbr is null', () => {
    // The 1948 original Baltimore Bullets row has no modern ESPN logo.
    const urls = nbaConfig.logoResolver({
      year: 1948,
      noChampion: false,
      name: 'Baltimore Bullets',
      abbr: 'BAL',
      espnAbbr: null,
      color: '#002B5C',
      franchiseId: 'baltimore_bullets_og',
    });
    expect(urls).toEqual([]);
  });
});
