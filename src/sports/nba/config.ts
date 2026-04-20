import type { LogoResolver, SportConfig } from '../../shared/types';
import { CHAMPIONS } from './data';

// ESPN covers all 30 current NBA franchises; historical team names
// (e.g. "Minneapolis Lakers", "Seattle SuperSonics") resolve to the
// current-franchise ESPN logo via espnAbbr. The text-badge tier (see
// TeamLogo) handles the one row that has no espnAbbr — the defunct
// 1948 Baltimore Bullets, which have no modern CDN representation.
const logoResolver: LogoResolver = (c) =>
  c.espnAbbr ? [`https://a.espncdn.com/i/teamlogos/nba/500/${c.espnAbbr}.png`] : [];

export const nbaConfig: SportConfig = {
  id: 'nba',
  route: '/nba',
  name: 'NBA',
  trophyName: 'Larry O\u2019Brien Trophy',
  championshipName: 'NBA Finals',
  firstYear: 1947,
  rows: CHAMPIONS,
  logoResolver,
  // Spot-check milestones: franchise totals that anchor the running-count
  // rollup logic. Keep in sync with milestones.test.ts.
  milestones: [
    { franchiseId: 'celtics', expectedCount: 18, throughYear: 2024 },
    { franchiseId: 'lakers', expectedCount: 17, throughYear: 2020 },
    { franchiseId: 'warriors', expectedCount: 7, throughYear: 2022 },
    { franchiseId: 'bulls', expectedCount: 6, throughYear: 1998 },
  ],
};
