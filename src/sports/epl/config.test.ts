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

  it('logoResolver returns [] for every row (text-badge tier only)', () => {
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
    expect(urls).toEqual([]);
  });
});
