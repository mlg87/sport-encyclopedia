import { describe, it, expect } from 'vitest';
import { computeRunningTitleCounts } from '../../shared/computeTitles';
import { DRIVERS_CHAMPIONS } from './drivers';

// Because each row's franchiseId is a per-driver slug, the running total
// returned by computeRunningTitleCounts is the driver's CAREER world
// championship count through that year. These milestones anchor the
// rollup so data edits don't silently perturb historical counts.
describe('F1 Drivers dataset milestones', () => {
  it('produces the expected running totals for canonical drivers', () => {
    const counts = computeRunningTitleCounts(DRIVERS_CHAMPIONS);
    // Map by (franchiseId, year) because some years have no Hamilton row
    // etc.; we want the last running total for the asserted driver up to
    // and including the assertion year.
    const lastByDriverThroughYear = new Map<string, number>();
    DRIVERS_CHAMPIONS.forEach((c, i) => {
      if (c.noChampion) return;
      lastByDriverThroughYear.set(`${c.franchiseId}:${c.year}`, counts[i]);
    });

    // Hamilton: 7 career titles through 2020 (2008, 2014-15, 2017-20).
    expect(lastByDriverThroughYear.get('hamilton_lewis:2020')).toBe(7);
    // Schumacher: 7 career titles through 2004 (1994, 95, 2000-04).
    expect(lastByDriverThroughYear.get('schumacher_michael:2004')).toBe(7);
    // Fangio: 5 career titles through 1957 (1951, 54, 55, 56, 57).
    expect(lastByDriverThroughYear.get('fangio_juan_manuel:1957')).toBe(5);
    // Verstappen: 4 career titles through 2024 (2021-24).
    expect(lastByDriverThroughYear.get('verstappen_max:2024')).toBe(4);
  });

  it('keeps the three different Hills on distinct driver ids', () => {
    // Phil Hill (1961, USA), Graham Hill (1962/1968, UK), Damon Hill
    // (1996, UK; Graham's son) share a surname but are separate careers.
    const counts = computeRunningTitleCounts(DRIVERS_CHAMPIONS);
    const byKey = new Map<string, number>();
    DRIVERS_CHAMPIONS.forEach((c, i) => {
      if (c.noChampion) return;
      byKey.set(`${c.franchiseId}:${c.year}`, counts[i]);
    });
    expect(byKey.get('hill_phil:1961')).toBe(1);
    expect(byKey.get('hill_graham:1962')).toBe(1);
    expect(byKey.get('hill_graham:1968')).toBe(2);
    expect(byKey.get('hill_damon:1996')).toBe(1);
  });

  it('keeps Keke Rosberg (1982) and Nico Rosberg (2016) on distinct ids', () => {
    const counts = computeRunningTitleCounts(DRIVERS_CHAMPIONS);
    const byKey = new Map<string, number>();
    DRIVERS_CHAMPIONS.forEach((c, i) => {
      if (c.noChampion) return;
      byKey.set(`${c.franchiseId}:${c.year}`, counts[i]);
    });
    expect(byKey.get('rosberg_keke:1982')).toBe(1);
    expect(byKey.get('rosberg_nico:2016')).toBe(1);
  });

  it('populates subtitle with the 2024 constructor for cross-reference with Constructors page', () => {
    const row2024 = DRIVERS_CHAMPIONS.find((c) => c.year === 2024);
    expect(row2024).toBeDefined();
    if (row2024 && !row2024.noChampion) {
      expect(row2024.subtitle).toBe('Red Bull Racing');
    }
  });
});
