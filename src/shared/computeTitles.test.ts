import { describe, it, expect } from 'vitest';
import { computeRunningTitleCounts } from './computeTitles';
import type { Champion, Row } from './types';

describe('computeRunningTitleCounts', () => {
  it('returns 0 for no-champion rows', () => {
    const rows: Row[] = [
      { year: 1919, noChampion: true, reason: 'influenza' },
      { year: 2005, noChampion: true, reason: 'lockout' },
    ];
    expect(computeRunningTitleCounts(rows)).toEqual([0, 0]);
  });

  it('increments running total per franchise', () => {
    const rows: Row[] = [
      mkWin(1993, 'canadiens'),
      mkWin(1994, 'rangers'),
      mkWin(1995, 'devils'),
      mkWin(2000, 'devils'),
    ];
    expect(computeRunningTitleCounts(rows)).toEqual([1, 1, 1, 2]);
  });

  it('rolls totals across franchise renames via shared franchiseId', () => {
    // Toronto's franchise_id is "toronto" across Blueshirts, Arenas,
    // St. Patricks, Maple Leafs — so the running total spans all four names.
    const rows: Row[] = [
      mkWin(1914, 'toronto', 'Toronto Blueshirts'),
      mkWin(1918, 'toronto', 'Toronto Arenas'),
      mkWin(1922, 'toronto', 'Toronto St. Patricks'),
      mkWin(1932, 'toronto', 'Toronto Maple Leafs'),
    ];
    expect(computeRunningTitleCounts(rows)).toEqual([1, 2, 3, 4]);
  });

  it('skips no-champion rows without affecting totals', () => {
    const rows: Row[] = [
      mkWin(1918, 'toronto'),
      { year: 1919, noChampion: true, reason: 'influenza' },
      mkWin(1922, 'toronto'),
    ];
    expect(computeRunningTitleCounts(rows)).toEqual([1, 0, 2]);
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
