import { describe, it, expect } from 'vitest';
import { computeRunningTitleCounts } from '../../shared/computeTitles';
import { CONSTRUCTORS_CHAMPIONS } from './constructors';

// Constructors' titles roll up per the lineage rules documented in
// constructors.ts: mclaren/ferrari/williams/lotus/red_bull each span
// multiple engine partners and era renames, while vanwall/benetton/brawn
// each keep their own franchiseId despite later rebrands.
describe('F1 Constructors dataset milestones', () => {
  it('produces the expected running totals for canonical constructors', () => {
    const counts = computeRunningTitleCounts(CONSTRUCTORS_CHAMPIONS);
    const byKey = new Map<string, number>();
    CONSTRUCTORS_CHAMPIONS.forEach((c, i) => {
      if (c.noChampion) return;
      byKey.set(`${c.franchiseId}:${c.year}`, counts[i]);
    });

    // Ferrari: 16 titles through 2008 (1961, 64, 75, 76, 77, 79, 82, 83,
    // 99, 2000, 01, 02, 03, 04, 07, 08).
    expect(byKey.get('ferrari:2008')).toBe(16);
    // Williams: 9 titles through 1997 (1980, 81, 86, 87, 92, 93, 94, 96, 97).
    expect(byKey.get('williams:1997')).toBe(9);
    // McLaren: 9 titles through 2024 (1974, 84, 85, 88, 89, 90, 91, 98,
    // 2024) — 2024 was their first since 1998.
    expect(byKey.get('mclaren:2024')).toBe(9);
    // Mercedes as a constructor entity: 7 titles through 2020. The 1954/55
    // Fangio titles predate the constructors' championship (instituted
    // 1958), so they don't count here.
    expect(byKey.get('mercedes:2020')).toBe(7);
  });

  it('rolls Lotus across Climax and Ford engine eras', () => {
    const counts = computeRunningTitleCounts(CONSTRUCTORS_CHAMPIONS);
    const byKey = new Map<string, number>();
    CONSTRUCTORS_CHAMPIONS.forEach((c, i) => {
      if (c.noChampion) return;
      byKey.set(`${c.franchiseId}:${c.year}`, counts[i]);
    });
    // Lotus: 7 titles through 1978 (1963, 65, 68, 70, 72, 73, 78).
    expect(byKey.get('lotus:1978')).toBe(7);
  });

  it('rolls Red Bull across Renault and Honda eras', () => {
    const counts = computeRunningTitleCounts(CONSTRUCTORS_CHAMPIONS);
    const byKey = new Map<string, number>();
    CONSTRUCTORS_CHAMPIONS.forEach((c, i) => {
      if (c.noChampion) return;
      byKey.set(`${c.franchiseId}:${c.year}`, counts[i]);
    });
    // Red Bull: 6 titles through 2023 (2010-13 + 2022, 2023).
    expect(byKey.get('red_bull:2023')).toBe(6);
  });

  it('keeps Brawn GP on its own franchiseId (not rolled into Mercedes)', () => {
    const counts = computeRunningTitleCounts(CONSTRUCTORS_CHAMPIONS);
    const byKey = new Map<string, number>();
    CONSTRUCTORS_CHAMPIONS.forEach((c, i) => {
      if (c.noChampion) return;
      byKey.set(`${c.franchiseId}:${c.year}`, counts[i]);
    });
    // Brawn: exactly one title (2009) under its own id. Sold to Mercedes
    // for 2010 but the record stays with Brawn.
    expect(byKey.get('brawn:2009')).toBe(1);
    // Mercedes' first constructors' title came in 2014 (not 2010), so
    // its running total should still be 1 at end of 2014.
    expect(byKey.get('mercedes:2014')).toBe(1);
  });

  it('keeps Benetton 1995 separate from later Renault F1 Team titles', () => {
    const counts = computeRunningTitleCounts(CONSTRUCTORS_CHAMPIONS);
    const byKey = new Map<string, number>();
    CONSTRUCTORS_CHAMPIONS.forEach((c, i) => {
      if (c.noChampion) return;
      byKey.set(`${c.franchiseId}:${c.year}`, counts[i]);
    });
    // Benetton Formula: exactly one title (1995).
    expect(byKey.get('benetton:1995')).toBe(1);
    // Renault F1 Team: 2 titles (2005, 2006), independent of Benetton.
    expect(byKey.get('renault:2005')).toBe(1);
    expect(byKey.get('renault:2006')).toBe(2);
  });
});
