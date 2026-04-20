import { describe, it, expect } from 'vitest';
import { computeRunningTitleCounts } from '../../shared/computeTitles';
import { CHAMPIONS } from './data';

describe('NBA dataset milestones', () => {
  it('produces the expected running totals for canonical franchises', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // Celtics: 18 Finals titles through 2024 (1957, 59-66, 68, 69, 74,
    // 76, 81, 84, 86, 2008, 2024).
    expect(byYear.get(2024)).toBe(18);
    // Lakers franchise (Minneapolis + LA combined): 17 through 2020
    // (1949, 50, 52, 53, 54, 72, 80, 82, 85, 87, 88, 2000, 01, 02, 09,
    // 10, 20).
    expect(byYear.get(2020)).toBe(17);
    // Warriors franchise (Philadelphia + San Francisco + Golden State):
    // 7 through 2022 (1947, 56, 75, 2015, 17, 18, 22).
    expect(byYear.get(2022)).toBe(7);
    // Bulls: 6 through the 1997-98 season (two three-peats: 91-93, 96-98).
    expect(byYear.get(1998)).toBe(6);
  });

  it('rolls Hawks franchise across Tri-Cities / Milwaukee / St. Louis / Atlanta', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // Hawks' only NBA title came in 1958 as the St. Louis Hawks. All
    // four franchise names share the `hawks` id.
    expect(byYear.get(1958)).toBe(1);
  });

  it('rolls Kings franchise across Rochester / Cincinnati / KC / Sacramento', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // Franchise won in 1951 as the Rochester Royals; counted under the
    // modern `kings` id.
    expect(byYear.get(1951)).toBe(1);
  });

  it('rolls 76ers franchise across Syracuse Nationals and Philadelphia', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // Syracuse Nationals in 1955, Philadelphia 76ers in 1967 and 1983 —
    // all three roll up under `sixers`.
    expect(byYear.get(1955)).toBe(1);
    expect(byYear.get(1967)).toBe(2);
    expect(byYear.get(1983)).toBe(3);
  });

  it('keeps the 1948 original Baltimore Bullets on a distinct franchise id', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // The 1948 BAA champion Baltimore Bullets (1944-54) disbanded and
    // share no lineage with the later Bullets/Wizards. The one row for
    // 1948 must stand alone and never roll up into `wizards`.
    expect(byYear.get(1948)).toBe(1);
    const bullets1948 = CHAMPIONS.find((c) => c.year === 1948);
    expect(bullets1948).toBeDefined();
    if (bullets1948 && !bullets1948.noChampion) {
      expect(bullets1948.franchiseId).toBe('baltimore_bullets_og');
    }
  });
});
