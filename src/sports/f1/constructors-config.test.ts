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

  it('logoResolver returns formula1.com URL for a current constructor', () => {
    const urls = f1ConstructorsConfig.logoResolver({
      year: 2024,
      noChampion: false,
      name: 'McLaren-Mercedes',
      abbr: 'MCL',
      espnAbbr: null,
      color: '#FF8700',
      franchiseId: 'mclaren',
    });
    expect(urls).toEqual([
      'https://media.formula1.com/content/dam/fom-website/teams/2025/mclaren-logo.png',
    ]);
  });

  it('logoResolver renames red_bull to the formula1.com slug', () => {
    // franchiseId uses snake_case (`red_bull`) but the F1 CDN uses the
    // kebab-cased team slug (`red-bull-racing`) - make sure the mapping
    // bridges the two correctly.
    const urls = f1ConstructorsConfig.logoResolver({
      year: 2023,
      noChampion: false,
      name: 'Red Bull Racing',
      abbr: 'RBR',
      espnAbbr: null,
      color: '#1E41FF',
      franchiseId: 'red_bull',
    });
    expect(urls).toEqual([
      'https://media.formula1.com/content/dam/fom-website/teams/2025/red-bull-racing-logo.png',
    ]);
  });

  it('logoResolver returns [] for defunct / one-off champion constructors', () => {
    // Vanwall, Brabham, Matra, Tyrrell, BRM, Cooper, Lotus, Benetton,
    // Brawn, and the 2005-06 Renault works team all lack a stable modern
    // logo CDN, so the resolver must fall through to the text-badge tier.
    for (const franchiseId of ['vanwall', 'lotus', 'benetton', 'brawn', 'renault']) {
      const urls = f1ConstructorsConfig.logoResolver({
        year: 2000,
        noChampion: false,
        name: 'Ignored',
        abbr: 'IGN',
        espnAbbr: null,
        color: '#000000',
        franchiseId,
      });
      expect(urls).toEqual([]);
    }
  });
});
