import { describe, it, expect } from 'vitest';
import { computeRunningTitleCounts } from '../../shared/computeTitles';
import { CHAMPIONS } from './data';

describe('MLB dataset milestones', () => {
  it('produces the expected running totals for canonical franchises', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    // Because multiple champions can share a year only across different
    // sports (never within MLB), a single scalar per year is sufficient.
    // Still, we scope the lookup to the yankees/cardinals/etc. rows so
    // no-champion years (1904, 1994) don't accidentally overwrite a real
    // running total for an adjacent franchise.
    const lastCountFor = (franchiseId: string, throughYear: number): number => {
      let last = 0;
      CHAMPIONS.forEach((c, i) => {
        if (c.year > throughYear) return;
        if (c.noChampion) return;
        if (c.franchiseId !== franchiseId) return;
        last = counts[i];
      });
      return last;
    };

    // Yankees: 27 titles through 2009 (1923, 27, 28, 32, 36, 37, 38, 39,
    // 41, 43, 47, 49, 50, 51, 52, 53, 56, 58, 61, 62, 77, 78, 96, 98, 99,
    // 2000, 09).
    expect(lastCountFor('yankees', 2009)).toBe(27);
    // Cardinals: 11 through 2011 (1926, 31, 34, 42, 44, 46, 64, 67, 82,
    // 2006, 11).
    expect(lastCountFor('cardinals', 2011)).toBe(11);
    // Athletics franchise (Philadelphia + Oakland combined under
    // `athletics`): 9 through 1989 (1910, 11, 13, 29, 30 Philly; 1972,
    // 73, 74, 89 Oakland). KC era had no titles.
    expect(lastCountFor('athletics', 1989)).toBe(9);
    // Red Sox: 9 through 2018 (1903, 12, 15, 16, 18, 2004, 07, 13, 18).
    expect(lastCountFor('red_sox', 2018)).toBe(9);
  });

  it('rolls Braves franchise across Boston / Milwaukee / Atlanta', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const lastCountFor = (franchiseId: string, throughYear: number): number => {
      let last = 0;
      CHAMPIONS.forEach((c, i) => {
        if (c.year > throughYear) return;
        if (c.noChampion) return;
        if (c.franchiseId !== franchiseId) return;
        last = counts[i];
      });
      return last;
    };

    // Boston 1914, Milwaukee 1957, Atlanta 1995 + 2021 under `braves`.
    expect(lastCountFor('braves', 2021)).toBe(4);
  });

  it('rolls Dodgers franchise across Brooklyn and Los Angeles', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const lastCountFor = (franchiseId: string, throughYear: number): number => {
      let last = 0;
      CHAMPIONS.forEach((c, i) => {
        if (c.year > throughYear) return;
        if (c.noChampion) return;
        if (c.franchiseId !== franchiseId) return;
        last = counts[i];
      });
      return last;
    };

    // Brooklyn 1955 + LA 1959, 63, 65, 81, 88, 2020, 2024.
    expect(lastCountFor('dodgers', 2024)).toBe(8);
  });

  it('rolls Giants franchise across New York and San Francisco', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const lastCountFor = (franchiseId: string, throughYear: number): number => {
      let last = 0;
      CHAMPIONS.forEach((c, i) => {
        if (c.year > throughYear) return;
        if (c.noChampion) return;
        if (c.franchiseId !== franchiseId) return;
        last = counts[i];
      });
      return last;
    };

    // NY 1905, 21, 22, 33, 54 + SF 2010, 12, 14.
    expect(lastCountFor('giants', 2014)).toBe(8);
  });

  it('rolls Twins franchise across (original) Washington Senators and Minnesota', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const lastCountFor = (franchiseId: string, throughYear: number): number => {
      let last = 0;
      CHAMPIONS.forEach((c, i) => {
        if (c.year > throughYear) return;
        if (c.noChampion) return;
        if (c.franchiseId !== franchiseId) return;
        last = counts[i];
      });
      return last;
    };

    // 1924 Washington Senators (original) + 1987, 1991 Minnesota Twins.
    // The 1961-71 second Senators franchise (Rangers lineage) never won,
    // so this total must NOT include 2023.
    expect(lastCountFor('twins', 1991)).toBe(3);
    // 2023 Rangers title rolls up under `rangers`, not `twins`.
    expect(lastCountFor('twins', 2024)).toBe(3);
  });

  it('keeps the three Washington franchises on distinct ids', () => {
    // 1924 Senators -> Twins lineage, 2019 Nationals -> Expos lineage,
    // 2023 Rangers -> second-Senators lineage. Each must surface under
    // its own franchiseId.
    const row1924 = CHAMPIONS.find((c) => c.year === 1924);
    const row2019 = CHAMPIONS.find((c) => c.year === 2019);
    const row2023 = CHAMPIONS.find((c) => c.year === 2023);
    expect(row1924 && !row1924.noChampion && row1924.franchiseId).toBe('twins');
    expect(row2019 && !row2019.noChampion && row2019.franchiseId).toBe('nationals');
    expect(row2023 && !row2023.noChampion && row2023.franchiseId).toBe('rangers');
  });

  it('rolls Orioles franchise (Baltimore era only; Browns never won)', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const lastCountFor = (franchiseId: string, throughYear: number): number => {
      let last = 0;
      CHAMPIONS.forEach((c, i) => {
        if (c.year > throughYear) return;
        if (c.noChampion) return;
        if (c.franchiseId !== franchiseId) return;
        last = counts[i];
      });
      return last;
    };

    // Baltimore 1966 alone.
    expect(lastCountFor('orioles', 1966)).toBe(1);
    // Through 1983: Baltimore 1966, 1970, 1983.
    expect(lastCountFor('orioles', 1983)).toBe(3);
  });
});
