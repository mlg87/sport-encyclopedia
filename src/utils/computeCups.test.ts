import { describe, it, expect } from 'vitest';
import { computeRunningCupCounts } from './computeCups';
import { CHAMPIONS } from '../data';
import type { Champion } from '../data';

describe('computeRunningCupCounts', () => {
  it('returns 0 for no-champion rows', () => {
    const champions: Champion[] = [
      { year: 1919, noChampion: true, reason: 'influenza' },
      { year: 2005, noChampion: true, reason: 'lockout' },
    ];
    expect(computeRunningCupCounts(champions)).toEqual([0, 0]);
  });

  it('increments running total per franchise', () => {
    const champions: Champion[] = [
      mkWin(1993, 'canadiens'),
      mkWin(1994, 'rangers'),
      mkWin(1995, 'devils'),
      mkWin(2000, 'devils'),
    ];
    expect(computeRunningCupCounts(champions)).toEqual([1, 1, 1, 2]);
  });

  it('rolls totals across franchise renames via shared franchiseId', () => {
    // Toronto's franchise_id is "toronto" across Blueshirts, Arenas,
    // St. Patricks, Maple Leafs — so the running total spans all four names.
    const champions: Champion[] = [
      mkWin(1914, 'toronto', 'Toronto Blueshirts'),
      mkWin(1918, 'toronto', 'Toronto Arenas'),
      mkWin(1922, 'toronto', 'Toronto St. Patricks'),
      mkWin(1932, 'toronto', 'Toronto Maple Leafs'),
    ];
    expect(computeRunningCupCounts(champions)).toEqual([1, 2, 3, 4]);
  });

  it('skips no-champion rows without affecting totals', () => {
    const champions: Champion[] = [
      mkWin(1918, 'toronto'),
      { year: 1919, noChampion: true, reason: 'influenza' },
      mkWin(1922, 'toronto'),
    ];
    expect(computeRunningCupCounts(champions)).toEqual([1, 0, 2]);
  });

  it('produces correct totals for the full historical dataset', () => {
    // Spot-check a handful of well-known franchise milestones to guard
    // against accidental data drift.
    const counts = computeRunningCupCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // Canadiens: 24 total cups through 1993 (their last win).
    expect(byYear.get(1993)).toBe(24);
    // Toronto franchise rolls up Blueshirts + Arenas + St. Pats + Maple Leafs;
    // 14 cups by their 1967 win (last Cup they've won).
    expect(byYear.get(1967)).toBe(14);
    // Red Wings: 11 cups through 2008.
    expect(byYear.get(2008)).toBe(11);
    // Panthers: 2 cups through 2025 (back-to-back).
    expect(byYear.get(2025)).toBe(2);
  });
});

function mkWin(year: number, franchiseId: string, name = 'Team'): Champion {
  return {
    year,
    noChampion: false,
    name,
    abbr: 'XXX',
    espnAbbr: null,
    color: '#000000',
    franchiseId,
  };
}
