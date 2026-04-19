import { useMemo, useState } from 'react';
import { CHAMPIONS } from './data';
import { computeRunningCupCounts } from './utils/computeCups';
import { buildDecadeViews, getWinningTeams, type SortDirection } from './utils/viewModel';
import { ChampionRow } from './components/ChampionRow';
import { DecadeGroup } from './components/DecadeGroup';
import { DecadeChips } from './components/nav/DecadeChips';
import { Toolbar } from './components/toolbar/Toolbar';
import './components/nav/nav.css';
import './components/toolbar/toolbar.css';

export default function App() {
  // Cup counts are always computed chronologically off the full dataset —
  // a team's cup count at the time of their win is a historical fact and
  // shouldn't change with sort direction or filter selection. We key by
  // year (unique) so the lookup survives any decade reordering.
  const cupCountByYear = useMemo(() => {
    const counts = computeRunningCupCounts(CHAMPIONS);
    const map = new Map<number, number>();
    CHAMPIONS.forEach((c, i) => map.set(c.year, counts[i]));
    return map;
  }, []);

  const allTeams = useMemo(() => getWinningTeams(CHAMPIONS), []);

  // Default to newest-first — most recent champion is usually the point
  // of entry for casual readers.
  const [sort, setSort] = useState<SortDirection>('desc');
  const [selectedTeams, setSelectedTeams] = useState<ReadonlySet<string>>(() => new Set());

  const decadeViews = useMemo(
    () => buildDecadeViews(CHAMPIONS, selectedTeams, sort),
    [selectedTeams, sort],
  );
  const decadeNumbers = useMemo(() => decadeViews.map((v) => v.decade), [decadeViews]);

  const hasFilter = selectedTeams.size > 0;
  const matchCount = decadeViews.reduce((n, v) => n + v.entries.length, 0);

  return (
    <div className="page">
      <DecadeChips decades={decadeNumbers} />

      <header className="masthead">
        <p className="masthead__kicker">An illustrated ledger</p>
        <h1 className="masthead__title">Stanley Cup Champions</h1>
        <p className="masthead__range">1893 &mdash; 2025</p>
        <p className="masthead__blurb">
          Every champion of hockey&rsquo;s oldest trophy, from the Challenge Era through the modern
          NHL. Running totals count by franchise, not by name.
        </p>
      </header>

      <Toolbar
        sort={sort}
        onSortChange={setSort}
        allTeams={allTeams}
        selectedTeams={selectedTeams}
        onSelectedTeamsChange={setSelectedTeams}
      />

      {hasFilter && (
        <p className="filter-summary" aria-live="polite">
          {matchCount === 0
            ? `No matches for the selected team${selectedTeams.size === 1 ? '' : 's'}.`
            : `${matchCount} match${matchCount === 1 ? '' : 'es'} across ${decadeViews.filter((v) => !v.empty).length} decade${decadeViews.filter((v) => !v.empty).length === 1 ? '' : 's'}.`}
          <button
            type="button"
            className="filter-summary__reset"
            onClick={() => setSelectedTeams(new Set())}
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
            emptyMessage={
              selectedTeams.size === 1
                ? `No wins this decade for ${Array.from(selectedTeams)[0]}.`
                : 'No wins this decade for the selected teams.'
            }
          >
            {view.entries.map((champion, i) => (
              <ChampionRow
                key={champion.year}
                champion={champion}
                cupCount={cupCountByYear.get(champion.year) ?? 0}
                index={i}
              />
            ))}
          </DecadeGroup>
        ))}
      </main>

      <footer className="colophon">
        <p>
          Franchise totals roll up through name changes &mdash; Toronto&rsquo;s count spans the
          Blueshirts, Arenas, St.&nbsp;Patricks, and Maple&nbsp;Leafs eras.
        </p>
        <p className="colophon__version">
          {/* Version is injected at build time via vite.config.ts `define`.
              Release notes live on GitHub Releases (there's no CHANGELOG.md
              in the repo — semantic-release publishes notes directly to the
              Releases page to avoid committing back to a protected main). */}
          <a
            className="colophon__version-link"
            href="https://github.com/mlg87/sport-encyclopedia/releases"
            target="_blank"
            rel="noreferrer noopener"
          >
            v{__APP_VERSION__}
          </a>
        </p>
      </footer>
    </div>
  );
}
