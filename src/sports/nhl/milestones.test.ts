import { describe, it, expect } from 'vitest';
import { computeRunningTitleCounts } from '../../shared/computeTitles';
import { CHAMPIONS } from './data';

describe('NHL dataset milestones', () => {
  it('produces the expected running totals for canonical franchises', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // Canadiens: 24 total cups through 1993 (their last win).
    expect(byYear.get(1993)).toBe(24);
    // Toronto franchise rolls up Blueshirts + Arenas + St. Pats + Maple Leafs;
    // 14 cups by their 1967 win.
    expect(byYear.get(1967)).toBe(14);
    // Red Wings: 11 cups through 2008.
    expect(byYear.get(2008)).toBe(11);
    // Panthers: 2 cups through 2025 (back-to-back).
    expect(byYear.get(2025)).toBe(2);
  });
});
