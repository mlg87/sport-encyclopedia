import { describe, it, expect } from 'vitest';
import { nhlConfig } from './config';

describe('nhlConfig', () => {
  it('has the expected identifying fields', () => {
    expect(nhlConfig.id).toBe('nhl');
    expect(nhlConfig.route).toBe('/nhl');
    expect(nhlConfig.name).toBe('NHL');
    expect(nhlConfig.trophyName).toBe('Stanley Cup');
    expect(nhlConfig.championshipName).toBe('Stanley Cup Final');
    expect(nhlConfig.firstYear).toBe(1893);
  });

  it('wires rows through to the NHL dataset', () => {
    expect(nhlConfig.rows.length).toBeGreaterThan(100);
    expect(nhlConfig.rows[0]).toMatchObject({ year: 1893 });
  });

  it('logoResolver returns ESPN + NHL SVG URLs for modern teams', () => {
    const urls = nhlConfig.logoResolver({
      year: 2025,
      noChampion: false,
      name: 'Florida Panthers',
      abbr: 'FLA',
      espnAbbr: 'fla',
      color: '#C8102E',
      franchiseId: 'panthers',
    });
    expect(urls).toEqual([
      'https://a.espncdn.com/i/teamlogos/nhl/500/fla.png',
      'https://assets.nhle.com/logos/nhl/svg/FLA_dark.svg',
    ]);
  });

  it('logoResolver omits ESPN URL for pre-ESPN teams', () => {
    const urls = nhlConfig.logoResolver({
      year: 1893,
      noChampion: false,
      name: 'Montreal HC',
      abbr: 'MHC',
      espnAbbr: null,
      color: '#1a3a5c',
      franchiseId: 'montreal_hc',
    });
    expect(urls).toEqual(['https://assets.nhle.com/logos/nhl/svg/MHC_dark.svg']);
  });
});
