import { describe, it, expect } from 'vitest';
import { f1ConstructorsConfig } from './constructors-config';

describe('f1ConstructorsConfig', () => {
  it('has the expected identifying fields', () => {
    expect(f1ConstructorsConfig.id).toBe('f1-constructors');
    expect(f1ConstructorsConfig.route).toBe('/f1/constructors');
    expect(f1ConstructorsConfig.name).toBe('F1 Constructors');
    expect(f1ConstructorsConfig.trophyName).toBe('Constructors\u2019 Championship');
    expect(f1ConstructorsConfig.championshipName).toBe('Constructors\u2019 World Championship');
    // Constructors' title was instituted in 1958, eight seasons after
    // the drivers' championship.
    expect(f1ConstructorsConfig.firstYear).toBe(1958);
  });

  it('wires rows through to the 1958-2025 constructors dataset', () => {
    // 68 constructors' championships from 1958 through 2025 inclusive.
    expect(f1ConstructorsConfig.rows.length).toBe(68);
    expect(f1ConstructorsConfig.rows[0]).toMatchObject({ year: 1958, name: 'Vanwall' });
  });

  it('logoResolver always returns an empty list (no F1 logo CDN)', () => {
    const urls = f1ConstructorsConfig.logoResolver({
      year: 2024,
      noChampion: false,
      name: 'McLaren-Mercedes',
      abbr: 'MCL',
      espnAbbr: null,
      color: '#FF8700',
      franchiseId: 'mclaren',
    });
    expect(urls).toEqual([]);
  });
});
