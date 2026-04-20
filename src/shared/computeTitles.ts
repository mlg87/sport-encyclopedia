import type { Row } from './types';

// Returns a parallel array: for each row, the running championship count
// for that franchise AS OF that year (inclusive). "No champion" rows get 0.
// Computed chronologically so multi-decade franchise name changes roll up
// into a single running total.
export function computeRunningTitleCounts(rows: Row[]): number[] {
  const totals: Record<string, number> = {};
  const out: number[] = [];
  for (const r of rows) {
    if (r.noChampion) {
      out.push(0);
      continue;
    }
    totals[r.franchiseId] = (totals[r.franchiseId] ?? 0) + 1;
    out.push(totals[r.franchiseId]);
  }
  return out;
}
