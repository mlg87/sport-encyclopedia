import { describe, it, expect } from 'vitest';
import { eplConfig } from './config';

describe('eplConfig', () => {
  it('has the expected identifying fields', () => {
    expect(eplConfig.id).toBe('epl');
    expect(eplConfig.route).toBe('/epl');
    expect(eplConfig.name).toBe('English top flight');
    expect(eplConfig.trophyName).toBe('English league title');
    expect(eplConfig.championshipName).toBe('English top-flight championship');
    expect(eplConfig.firstYear).toBe(1889);
  });

  it('wires rows through to the English top-flight dataset', () => {
    // 137 seasons from 1888-89 (year 1889) through 2024-25 (year 2025),
    // inclusive of 11 noChampion rows covering WWI and WWII suspensions.
    expect(eplConfig.rows.length).toBe(137);
    expect(eplConfig.rows[0]).toMatchObject({
      year: 1889,
      name: 'Preston North End',
      competitionLabel: 'First Division',
    });
  });

  it('labels the 1993 season as Premier League', () => {
    const row1993 = eplConfig.rows.find((r) => r.year === 1993);
    expect(row1993).toBeDefined();
    if (row1993 && !row1993.noChampion) {
      expect(row1993.competitionLabel).toBe('Premier League');
    }
  });

  it('records 1919 as a WWI noChampion row', () => {
    const row1919 = eplConfig.rows.find((r) => r.year === 1919);
    expect(row1919).toBeDefined();
    expect(row1919?.noChampion).toBe(true);
    if (row1919 && row1919.noChampion) {
      expect(row1919.reason).toMatch(/World War I/);
    }
  });

  it('logoResolver returns ESPN soccer URL for a known franchise', () => {
    const urls = eplConfig.logoResolver({
      year: 2024,
      noChampion: false,
      name: 'Manchester City',
      abbr: 'MCI',
      espnAbbr: null,
      color: '#6CABDD',
      franchiseId: 'man_city',
      competitionLabel: 'Premier League',
    });
    expect(urls).toEqual(['https://a.espncdn.com/i/teamlogos/soccer/500/382.png']);
  });

  it('logoResolver routes historical club names through the franchiseId', () => {
    // "The Wednesday" (1903-04) and modern Sheffield Wednesday share the
    // sheff_wed franchiseId, so both must resolve to the same ESPN logo.
    const urls = eplConfig.logoResolver({
      year: 1903,
      noChampion: false,
      name: 'The Wednesday',
      abbr: 'SHW',
      espnAbbr: null,
      color: '#1D44A6',
      franchiseId: 'sheff_wed',
      competitionLabel: 'First Division',
    });
    expect(urls).toEqual(['https://a.espncdn.com/i/teamlogos/soccer/500/399.png']);
  });

  it('logoResolver returns [] for an unknown franchiseId', () => {
    const urls = eplConfig.logoResolver({
      year: 2024,
      noChampion: false,
      name: 'Unknown FC',
      abbr: 'UNK',
      espnAbbr: null,
      color: '#000000',
      franchiseId: 'not_a_real_id',
    });
    expect(urls).toEqual([]);
  });
});
