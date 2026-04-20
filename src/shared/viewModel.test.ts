import { describe, it, expect } from 'vitest';
import { buildDecadeViews, getWinningFranchises } from './viewModel';
import type { Champion, Row } from './types';

const w = (year: number, name: string, franchiseId = name.toLowerCase()): Champion => ({
  year,
  noChampion: false,
  name,
  abbr: 'XXX',
  espnAbbr: null,
  color: '#000000',
  franchiseId,
});

const DATA: Row[] = [
  w(1914, 'Toronto Blueshirts', 'toronto'),
  w(1915, 'Vancouver Millionaires'),
  { year: 1919, noChampion: true, reason: 'influenza' },
  w(1922, 'Toronto St. Patricks', 'toronto'),
  w(1932, 'Toronto Maple Leafs', 'toronto'),
  w(1993, 'Montreal Canadiens'),
  w(2024, 'Florida Panthers'),
  w(2025, 'Florida Panthers'),
];

describe('buildDecadeViews', () => {
  it('groups chronologically by decade when no filter is applied (desc default)', () => {
    const views = buildDecadeViews(DATA, new Set(), 'desc');
    expect(views.map((v) => v.decade)).toEqual([2020, 1990, 1930, 1920, 1910]);
    // Within a decade, desc means newest year first.
    expect(views[0].entries.map((c) => c.year)).toEqual([2025, 2024]);
  });

  it('reverses within-decade order for asc', () => {
    const views = buildDecadeViews(DATA, new Set(), 'asc');
    expect(views.map((v) => v.decade)).toEqual([1910, 1920, 1930, 1990, 2020]);
    expect(views[0].entries.map((c) => c.year)).toEqual([1914, 1915, 1919]);
    expect(views[4].entries.map((c) => c.year)).toEqual([2024, 2025]);
  });

  it('filters champions by franchise_id and flags decades with no matches', () => {
    const views = buildDecadeViews(DATA, new Set(['florida panthers']), 'desc');
    // All decades still present so the user can see the full timeline.
    expect(views.map((v) => v.decade)).toEqual([2020, 1990, 1930, 1920, 1910]);
    // Only the 2020s decade has actual matches.
    expect(views[0].empty).toBe(false);
    expect(views[0].entries.map((c) => c.year)).toEqual([2025, 2024]);
    for (const v of views.slice(1)) {
      expect(v.empty).toBe(true);
      expect(v.entries).toEqual([]);
    }
  });

  it('matches every historical name variant when filtering by franchise_id', () => {
    // Picking Toronto (franchise_id: "toronto") should return all three
    // historical names in the data: Blueshirts, St. Patricks, Maple Leafs.
    const views = buildDecadeViews(DATA, new Set(['toronto']), 'asc');
    const torontoRows = views.flatMap((v) => v.entries).map((c) => (c.noChampion ? null : c.name));
    expect(torontoRows).toEqual([
      'Toronto Blueshirts',
      'Toronto St. Patricks',
      'Toronto Maple Leafs',
    ]);
  });

  it('filters "no champion" rows out when a franchise filter is active', () => {
    const views = buildDecadeViews(DATA, new Set(['vancouver millionaires']), 'desc');
    // 1919 (no champion) sits in the 1910s decade alongside Vancouver's win
    // but should be excluded because it can't match a franchise selection.
    const tens = views.find((v) => v.decade === 1910)!;
    expect(tens.entries.map((c) => c.year)).toEqual([1915]);
  });

  it('handles multi-franchise selection as OR', () => {
    const views = buildDecadeViews(DATA, new Set(['toronto', 'montreal canadiens']), 'asc');
    const yearsMatched = views.flatMap((v) => v.entries).map((c) => c.year);
    expect(yearsMatched).toEqual([1914, 1922, 1932, 1993]);
  });
});

describe('getWinningFranchises', () => {
  it('returns one entry per franchise_id, alphabetized by label', () => {
    const result = getWinningFranchises(DATA);
    expect(result).toEqual([
      { id: 'florida panthers', label: 'Florida Panthers' },
      { id: 'montreal canadiens', label: 'Montreal Canadiens' },
      { id: 'toronto', label: 'Toronto Maple Leafs' },
      { id: 'vancouver millionaires', label: 'Vancouver Millionaires' },
    ]);
  });

  it('uses the most recent display name when a franchise has multiple names', () => {
    // Toronto's three names appear in chronological order in DATA, so the
    // label should be the latest: "Toronto Maple Leafs".
    const toronto = getWinningFranchises(DATA).find((f) => f.id === 'toronto');
    expect(toronto?.label).toBe('Toronto Maple Leafs');
  });

  it('excludes "no champion" rows', () => {
    const ids = getWinningFranchises(DATA).map((f) => f.id);
    // 1919 has no franchise_id — ensure it didn't smuggle an entry in.
    expect(ids).not.toContain(undefined);
    expect(ids).toHaveLength(4);
  });
});
