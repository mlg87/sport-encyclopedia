import { describe, it, expect } from 'vitest';
import { computeRunningTitleCounts } from '../../shared/computeTitles';
import { CHAMPIONS } from './data';

describe('EPL dataset milestones', () => {
  it('produces the expected running totals for canonical clubs', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // Man United through 2013: 7 First Division (1908, 1911, 1952, 1956,
    // 1957, 1965, 1967) + 13 Premier League (1993, 94, 96, 97, 99, 2000,
    // 01, 03, 07, 08, 09, 11, 13) = 20. Running total must survive the
    // 1992 First Division -> 1993 Premier League rebrand.
    expect(byYear.get(2013)).toBe(20);
    // Liverpool through 2020: 18 First Division + 1 Premier League = 19.
    expect(byYear.get(2020)).toBe(19);
    // Arsenal through 2004: 10 First Division + 3 Premier League = 13.
    expect(byYear.get(2004)).toBe(13);
    // Everton through 1987: 9 titles, all First Division. The 1915 and
    // 1939 titles bracket both world-war suspensions.
    expect(byYear.get(1987)).toBe(9);
    // Man City through 2024: 2 First Division (1937, 1968) + 8 Premier
    // League (2012, 14, 18, 19, 21, 22, 23, 24) = 10.
    expect(byYear.get(2024)).toBe(10);
  });

  it('rolls Sheffield Wednesday across "The Wednesday" era', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // 1903 and 1904 titles were won as "The Wednesday" (era-accurate
    // display name); 1929 and 1930 as "Sheffield Wednesday". All four
    // roll up via the `sheff_wed` id.
    expect(byYear.get(1904)).toBe(2);
    expect(byYear.get(1930)).toBe(4);
  });

  it('rolls up long-serving single-city clubs', () => {
    const counts = computeRunningTitleCounts(CHAMPIONS);
    const byYear = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => byYear.set(c.year, counts[i]));

    // Sunderland: 6 titles through 1936 (1892, 1893, 1895, 1902, 1913,
    // 1936).
    expect(byYear.get(1936)).toBe(6);
    // Aston Villa: 7 titles through 1981 (1894, 1896, 1897, 1899, 1900,
    // 1910, 1981).
    expect(byYear.get(1981)).toBe(7);
    // Wolves: 3 titles through 1959 (1954, 1958, 1959).
    expect(byYear.get(1959)).toBe(3);
  });

  it('labels each era correctly at the 1992/1993 boundary', () => {
    // Last First Division champion.
    const leeds1992 = CHAMPIONS.find((c) => c.year === 1992);
    expect(leeds1992).toBeDefined();
    if (leeds1992 && !leeds1992.noChampion) {
      expect(leeds1992.franchiseId).toBe('leeds');
      expect(leeds1992.competitionLabel).toBe('First Division');
    }

    // First Premier League champion.
    const united1993 = CHAMPIONS.find((c) => c.year === 1993);
    expect(united1993).toBeDefined();
    if (united1993 && !united1993.noChampion) {
      expect(united1993.franchiseId).toBe('man_united');
      expect(united1993.competitionLabel).toBe('Premier League');
    }
  });

  it('records WWI and WWII suspensions as noChampion rows', () => {
    const years = (reason: string) =>
      CHAMPIONS.filter((c) => c.noChampion && c.reason === reason).map((c) => c.year);
    expect(years('World War I')).toEqual([1916, 1917, 1918, 1919]);
    expect(years('World War II')).toEqual([1940, 1941, 1942, 1943, 1944, 1945, 1946]);
  });
});
