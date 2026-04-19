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

export function buildDecadeViews(
  champions: Champion[],
  selectedTeams: ReadonlySet<string>,
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

  const hasFilter = selectedTeams.size > 0;
  const orderedDecades = Array.from(groups.keys()).sort((a, b) =>
    sort === 'desc' ? b - a : a - b,
  );

  return orderedDecades.map((decade) => {
    const all = groups.get(decade) ?? [];
    // Filtering excludes "no champion" rows regardless — they can't
    // match a team selection by definition, and showing them inside a
    // team-filtered view would be misleading.
    const matches = hasFilter ? all.filter((c) => !c.noChampion && selectedTeams.has(c.name)) : all;
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

/** Unique list of team display names that have ever won a Cup, alphabetical. */
export function getWinningTeams(champions: Champion[]): string[] {
  const seen = new Set<string>();
  for (const c of champions) {
    if (!c.noChampion) seen.add(c.name);
  }
  return Array.from(seen).sort((a, b) => a.localeCompare(b));
}
