import { describe, it, expect } from 'vitest';
import { f1DriversConfig } from './drivers-config';

describe('f1DriversConfig', () => {
  it('has the expected identifying fields', () => {
    expect(f1DriversConfig.id).toBe('f1-drivers');
    expect(f1DriversConfig.route).toBe('/f1/drivers');
    expect(f1DriversConfig.name).toBe('F1 Drivers');
    expect(f1DriversConfig.trophyName).toBe('Drivers\u2019 Championship');
    expect(f1DriversConfig.championshipName).toBe('Drivers\u2019 World Championship');
    expect(f1DriversConfig.firstYear).toBe(1950);
  });

  it('wires rows through to the 1950-2025 drivers dataset', () => {
    // 76 drivers' championships from 1950 through 2025 inclusive.
    expect(f1DriversConfig.rows.length).toBe(76);
    expect(f1DriversConfig.rows[0]).toMatchObject({ year: 1950, name: 'Giuseppe Farina' });
  });

  it('logoResolver always returns an empty list (no F1 logo CDN)', () => {
    const urls = f1DriversConfig.logoResolver({
      year: 2024,
      noChampion: false,
      name: 'Max Verstappen',
      abbr: 'VER',
      espnAbbr: null,
      color: '#1E41FF',
      franchiseId: 'verstappen_max',
      subtitle: 'Red Bull Racing',
    });
    expect(urls).toEqual([]);
  });
});
