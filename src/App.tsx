import { useMemo } from 'react';
import { CHAMPIONS } from './data';
import { computeRunningCupCounts } from './utils/computeCups';
import { ChampionRow } from './components/ChampionRow';
import { DecadeGroup } from './components/DecadeGroup';

type Decade = {
  decade: number;
  entries: { index: number }[];
};

// Bucket champions into decade groups. We keep the original index alongside
// each entry so ChampionRow can look up its precomputed running-cup count
// (computeRunningCupCounts returns a parallel array).
function groupByDecade(count: number): Decade[] {
  const groups = new Map<number, Decade>();
  for (let i = 0; i < count; i++) {
    const year = CHAMPIONS[i].year;
    const decade = Math.floor(year / 10) * 10;
    let group = groups.get(decade);
    if (!group) {
      group = { decade, entries: [] };
      groups.set(decade, group);
    }
    group.entries.push({ index: i });
  }
  return Array.from(groups.values()).sort((a, b) => a.decade - b.decade);
}

export default function App() {
  const runningCounts = useMemo(() => computeRunningCupCounts(CHAMPIONS), []);
  const decades = useMemo(() => groupByDecade(CHAMPIONS.length), []);

  return (
    <div className="page">
      <header className="masthead">
        <p className="masthead__kicker">An illustrated ledger</p>
        <h1 className="masthead__title">Stanley Cup Champions</h1>
        <p className="masthead__range">1893 &mdash; 2025</p>
        <p className="masthead__blurb">
          Every champion of hockey&rsquo;s oldest trophy, from the Challenge Era through the modern
          NHL. Running totals count by franchise, not by name.
        </p>
      </header>

      <main className="ledger">
        {decades.map((group) => (
          <DecadeGroup key={group.decade} decade={group.decade}>
            {group.entries.map(({ index }) => (
              <ChampionRow
                key={CHAMPIONS[index].year}
                champion={CHAMPIONS[index]}
                cupCount={runningCounts[index]}
                index={index}
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
              Links to the CHANGELOG maintained by semantic-release. */}
          <a
            className="colophon__version-link"
            href="https://github.com/mlg87/sport-encyclopedia/blob/main/CHANGELOG.md"
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
