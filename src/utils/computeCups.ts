import type { Champion } from '../data';

// Returns a parallel array: for each champion entry, the running cup count
// for that franchise AS OF that year (inclusive). "No champion" rows get 0.
// Computed chronologically so multi-decade franchise name changes roll up
// into a single running total.
export function computeRunningCupCounts(champions: Champion[]): number[] {
  const totals: Record<string, number> = {};
  const out: number[] = [];
  for (const c of champions) {
    if (c.noChampion) {
      out.push(0);
      continue;
    }
    totals[c.franchiseId] = (totals[c.franchiseId] ?? 0) + 1;
    out.push(totals[c.franchiseId]);
  }
  return out;
}
