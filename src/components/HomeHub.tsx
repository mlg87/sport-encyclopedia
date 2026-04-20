import { Link } from 'react-router-dom';
import type { SportConfig } from '../shared/types';
import type { ComingSoonEntry } from '../sports/registry';

interface HomeHubProps {
  sports: SportConfig[];
  comingSoon: ComingSoonEntry[];
}

function mostRecentChampion(sport: SportConfig): { year: number; name: string } | null {
  for (let i = sport.rows.length - 1; i >= 0; i--) {
    const r = sport.rows[i];
    if (!r.noChampion) return { year: r.year, name: r.name };
  }
  return null;
}

export function HomeHub({ sports, comingSoon }: HomeHubProps) {
  return (
    <div className="page">
      <header className="masthead">
        <p className="masthead__kicker">An illustrated ledger</p>
        <h1 className="masthead__title">Sport Encyclopedia</h1>
        <p className="masthead__blurb">
          Champion ledgers across major leagues. Running totals count by franchise, not by name.
        </p>
      </header>

      <main className="hub">
        <ul className="hub__grid">
          {sports.map((s) => {
            const mr = mostRecentChampion(s);
            const lastYear = s.rows[s.rows.length - 1]?.year ?? s.firstYear;
            return (
              <li key={s.id} className="hub__item">
                <Link to={s.route} className="hub__tile hub__tile--active">
                  <span className="hub__name">{s.name}</span>
                  <span className="hub__championship">{s.championshipName}</span>
                  <span className="hub__range">
                    {s.firstYear} &mdash; {lastYear}
                  </span>
                  {mr && (
                    <span className="hub__recent">
                      Most recent: {mr.name} ({mr.year})
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
          {comingSoon.map((cs) => (
            <li key={cs.id} className="hub__item">
              <div className="hub__tile hub__tile--soon" aria-label={`${cs.name}: coming soon`}>
                <span className="hub__name">{cs.name}</span>
                <span className="hub__championship">{cs.championshipName}</span>
                <span className="hub__soon">Coming soon</span>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
