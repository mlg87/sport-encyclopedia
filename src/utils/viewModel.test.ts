import { describe, it, expect } from 'vitest';
import { buildDecadeViews, getWinningTeams } from './viewModel';
import type { Champion } from '../data';

const w = (year: number, name: string, franchiseId = name.toLowerCase()): Champion => ({
  year,
  noChampion: false,
  name,
  abbr: 'XXX',
  espnAbbr: null,
  color: '#000000',
  franchiseId,
});

const DATA: Champion[] = [
  w(1914, 'Toronto Blueshirts', 'toronto'),
  w(1915, 'Vancouver Millionaires'),
  { year: 1919, noChampion: true, reason: 'influenza' },
  w(1922, 'Toronto St. Patricks', 'toronto'),
  w(1993, 'Montreal Canadiens'),
  w(2024, 'Florida Panthers'),
  w(2025, 'Florida Panthers'),
];

describe('buildDecadeViews', () => {
  it('groups chronologically by decade when no filter is applied (desc default)', () => {
    const views = buildDecadeViews(DATA, new Set(), 'desc');
    expect(views.map((v) => v.decade)).toEqual([2020, 1990, 1920, 1910]);
    // Within a decade, desc means newest year first.
    expect(views[0].entries.map((c) => c.year)).toEqual([2025, 2024]);
  });

  it('reverses within-decade order for asc', () => {
    const views = buildDecadeViews(DATA, new Set(), 'asc');
    expect(views.map((v) => v.decade)).toEqual([1910, 1920, 1990, 2020]);
    expect(views[0].entries.map((c) => c.year)).toEqual([1914, 1915, 1919]);
    expect(views[3].entries.map((c) => c.year)).toEqual([2024, 2025]);
  });

  it('filters champions by team name and flags decades with no matches', () => {
    const views = buildDecadeViews(DATA, new Set(['Florida Panthers']), 'desc');
    // All decades still present so the user can see the full timeline.
    expect(views.map((v) => v.decade)).toEqual([2020, 1990, 1920, 1910]);
    // Only the 2020s decade has actual matches.
    expect(views[0].empty).toBe(false);
    expect(views[0].entries.map((c) => c.year)).toEqual([2025, 2024]);
    for (const v of views.slice(1)) {
      expect(v.empty).toBe(true);
      expect(v.entries).toEqual([]);
    }
  });

  it('filters "no champion" rows out when filtering by team', () => {
    const views = buildDecadeViews(DATA, new Set(['Vancouver Millionaires']), 'desc');
    // 1919 (no champion) sits in the 1910s decade alongside Vancouver's win
    // but should be excluded because it can't match a team selection.
    const tens = views.find((v) => v.decade === 1910)!;
    expect(tens.entries.map((c) => c.year)).toEqual([1915]);
  });

  it('handles multi-team selection as OR', () => {
    const views = buildDecadeViews(
      DATA,
      new Set(['Toronto Blueshirts', 'Toronto St. Patricks']),
      'asc',
    );
    const tens = views.find((v) => v.decade === 1910)!;
    const twenties = views.find((v) => v.decade === 1920)!;
    expect(tens.entries.map((c) => c.year)).toEqual([1914]);
    expect(twenties.entries.map((c) => c.year)).toEqual([1922]);
  });
});

describe('getWinningTeams', () => {
  it('returns unique team names alphabetically, excluding "no champion" rows', () => {
    expect(getWinningTeams(DATA)).toEqual([
      'Florida Panthers',
      'Montreal Canadiens',
      'Toronto Blueshirts',
      'Toronto St. Patricks',
      'Vancouver Millionaires',
    ]);
  });
});
