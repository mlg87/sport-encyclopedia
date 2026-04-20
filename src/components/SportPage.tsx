import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { SportConfig } from '../shared/types';
import { computeRunningTitleCounts } from '../shared/computeTitles';
import { buildDecadeViews, getWinningFranchises, type SortDirection } from '../shared/viewModel';
import { ChampionRow } from './ChampionRow';
import { DecadeGroup } from './DecadeGroup';
import { DecadeChips } from './nav/DecadeChips';
import { Toolbar } from './toolbar/Toolbar';
import './nav/nav.css';
import './toolbar/toolbar.css';

interface SportPageProps {
  sport: SportConfig;
}

export function SportPage({ sport }: SportPageProps) {
  // Title counts are always computed chronologically off the full dataset —
  // a team's count at the time of their win is a historical fact and
  // shouldn't change with sort direction or filter selection. We key by
  // year (unique) so the lookup survives any decade reordering.
  const titleCountByYear = useMemo(() => {
    const counts = computeRunningTitleCounts(sport.rows);
    const map = new Map<number, number>();
    sport.rows.forEach((c, i) => map.set(c.year, counts[i]));
    return map;
  }, [sport.rows]);

  const franchises = useMemo(() => getWinningFranchises(sport.rows), [sport.rows]);
  const franchiseLabelById = useMemo(() => {
    const m = new Map<string, string>();
    for (const f of franchises) m.set(f.id, f.label);
    return m;
  }, [franchises]);

  const [sort, setSort] = useState<SortDirection>('desc');
  const [selectedFranchiseIds, setSelectedFranchiseIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const decadeViews = useMemo(
    () => buildDecadeViews(sport.rows, selectedFranchiseIds, sort),
    [sport.rows, selectedFranchiseIds, sort],
  );
  const decadeNumbers = useMemo(() => decadeViews.map((v) => v.decade), [decadeViews]);

  const hasFilter = selectedFranchiseIds.size > 0;
  const matchCount = decadeViews.reduce((n, v) => n + v.entries.length, 0);
  const nonEmptyDecadeCount = decadeViews.filter((v) => !v.empty).length;

  const emptyMessage = (() => {
    if (selectedFranchiseIds.size !== 1) return 'No wins this decade for the selected teams.';
    const onlyId = selectedFranchiseIds.values().next().value as string;
    const label = franchiseLabelById.get(onlyId) ?? 'selected team';
    return `No wins this decade for ${label}.`;
  })();

  // Masthead year range: firstYear from config, latest year from the data
  // so the page updates automatically as new seasons are appended.
  const lastYear = sport.rows[sport.rows.length - 1]?.year ?? sport.firstYear;

  return (
    <div className="page">
      <DecadeChips decades={decadeNumbers} />

      <nav className="page-nav" aria-label="Site navigation">
        <Link to="/" className="page-nav__back">
          <span aria-hidden="true">&larr;</span> All sports
        </Link>
      </nav>

      <header className="masthead">
        <p className="masthead__kicker">An illustrated ledger</p>
        <h1 className="masthead__title">{sport.trophyName} Champions</h1>
        <p className="masthead__range">
          {sport.firstYear} &mdash; {lastYear}
        </p>
        <p className="masthead__blurb">
          Every champion of the {sport.championshipName}. Running totals count by franchise, not by
          name.
        </p>
      </header>

      <Toolbar
        sort={sort}
        onSortChange={setSort}
        franchises={franchises}
        selectedFranchiseIds={selectedFranchiseIds}
        onSelectedFranchiseIdsChange={setSelectedFranchiseIds}
      />

      {hasFilter && (
        <p className="filter-summary" aria-live="polite">
          {matchCount === 0
            ? `No matches for the selected team${selectedFranchiseIds.size === 1 ? '' : 's'}.`
            : `${matchCount} match${matchCount === 1 ? '' : 'es'} across ${nonEmptyDecadeCount} decade${nonEmptyDecadeCount === 1 ? '' : 's'}.`}
          <button
            type="button"
            className="filter-summary__reset"
            onClick={() => setSelectedFranchiseIds(new Set())}
          >
            Clear filter
          </button>
        </p>
      )}

      <main className="ledger">
        {decadeViews.map((view) => (
          <DecadeGroup
            key={view.decade}
            decade={view.decade}
            empty={view.empty}
            emptyMessage={emptyMessage}
          >
            {view.entries.map((champion, i) => (
              <ChampionRow
                key={champion.year}
                champion={champion}
                cupCount={titleCountByYear.get(champion.year) ?? 0}
                index={i}
                logoResolver={sport.logoResolver}
              />
            ))}
          </DecadeGroup>
        ))}
      </main>
    </div>
  );
}
