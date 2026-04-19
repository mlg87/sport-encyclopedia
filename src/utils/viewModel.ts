import type { Champion } from '../data';

export type SortDirection = 'desc' | 'asc';

// Group + filter + sort all live in one pass so the component tree just
// renders. Kept separate from `data.ts` so the raw dataset stays
// chronological (cup count rollup depends on that) and the display model
// is derived per render with the current toolbar state.
export interface DecadeView {
  decade: number;
  entries: Champion[];
  /** True when a filter is active AND the decade has no matching champions. */
  empty: boolean;
}

/**
 * One option in the team filter, keyed by franchise_id so that name changes
 * across eras (Toronto Blueshirts → Arenas → St. Patricks → Maple Leafs)
 * collapse into a single selectable entry. The label is the franchise's
 * most recent display name — readers are most likely to search by the
 * current/best-known name.
 */
export interface FranchiseOption {
  id: string;
  label: string;
}

export function buildDecadeViews(
  champions: Champion[],
  selectedFranchiseIds: ReadonlySet<string>,
  sort: SortDirection,
): DecadeView[] {
  const groups = new Map<number, Champion[]>();
  for (const c of champions) {
    const decade = Math.floor(c.year / 10) * 10;
    const bucket = groups.get(decade);
    if (bucket) {
      bucket.push(c);
    } else {
      groups.set(decade, [c]);
    }
  }

  const hasFilter = selectedFranchiseIds.size > 0;
  const orderedDecades = Array.from(groups.keys()).sort((a, b) =>
    sort === 'desc' ? b - a : a - b,
  );

  return orderedDecades.map((decade) => {
    const all = groups.get(decade) ?? [];
    // Filtering excludes "no champion" rows regardless — they can't match
    // a franchise selection by definition, and showing them inside a
    // team-filtered view would be misleading.
    const matches = hasFilter
      ? all.filter((c) => !c.noChampion && selectedFranchiseIds.has(c.franchiseId))
      : all;
    const sorted = [...matches].sort((a, b) =>
      sort === 'desc' ? b.year - a.year : a.year - b.year,
    );
    return {
      decade,
      entries: sorted,
      empty: hasFilter && sorted.length === 0,
    };
  });
}

/**
 * One entry per Cup-winning franchise, labeled with the franchise's most
 * recent display name (we walk the dataset in order and let later names
 * overwrite earlier ones — for Toronto that's "Toronto Maple Leafs", not
 * "Toronto Blueshirts"). Sorted alphabetically by label for display.
 *
 * Using franchise_id as the key means a selection persists through name
 * changes: picking "Toronto Maple Leafs" matches Blueshirts/Arenas/St.
 * Patricks wins too.
 */
export function getWinningFranchises(champions: Champion[]): FranchiseOption[] {
  const byId = new Map<string, FranchiseOption>();
  for (const c of champions) {
    if (c.noChampion) continue;
    byId.set(c.franchiseId, { id: c.franchiseId, label: c.name });
  }
  return Array.from(byId.values()).sort((a, b) => a.label.localeCompare(b.label));
}
