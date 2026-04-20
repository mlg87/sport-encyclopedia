import { describe, it, expect } from 'vitest';
import { computeRunningTitleCounts } from '../../shared/computeTitles';
import { CHAMPIONS } from './data';

describe('NFL dataset milestones', () => {
  it('produces the expected running totals for canonical franchises', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // Steelers: 6 Super Bowls through the 2008 season (SB XL + XLIII most recent).
    expect(byYear.get(2008)).toBe(6);
    // Patriots: 6 through the 2018 season.
    expect(byYear.get(2018)).toBe(6);
    // 49ers: 5 through the 1994 season (Dynasty-era finale).
    expect(byYear.get(1994)).toBe(5);
    // Cowboys: 5 through the 1995 season.
    expect(byYear.get(1995)).toBe(5);
  });

  it('rolls Raiders franchise across Oakland / LA / Las Vegas', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // Raiders won SB XI (1976, Oakland), SB XV (1980, Oakland), SB XVIII
    // (1983, LA). All three roll up under franchiseId "raiders".
    expect(byYear.get(1976)).toBe(1);
    expect(byYear.get(1980)).toBe(2);
    expect(byYear.get(1983)).toBe(3);
  });

  it('rolls Rams franchise across LA / St. Louis / LA', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // Rams: St. Louis in 1999, LA in 2021 — both under franchiseId "rams".
    expect(byYear.get(1999)).toBe(1);
    expect(byYear.get(2021)).toBe(2);
  });

  it('rolls Commanders franchise across Redskins eras', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // Redskins won SBs in the 1982, 1987, and 1991 seasons — all under
    // franchiseId "commanders".
    expect(byYear.get(1982)).toBe(1);
    expect(byYear.get(1987)).toBe(2);
    expect(byYear.get(1991)).toBe(3);
  });

  it('rolls Colts franchise across Baltimore and Indianapolis', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // SB V (1970 season, Baltimore) + SB XLI (2006 season, Indianapolis).
    expect(byYear.get(1970)).toBe(1);
    expect(byYear.get(2006)).toBe(2);
  });
});
