import type { LogoResolver, SportConfig } from '../../shared/types';
import { CHAMPIONS } from './data';

// ESPN covers all 30 current MLB franchises; historical team names
// (e.g. "Brooklyn Dodgers", "Philadelphia Athletics", "Washington
// Senators") resolve to the modern-franchise ESPN logo via espnAbbr.
// All MLB rows in CHAMPIONS have a non-null espnAbbr, so the text-badge
// fallback is theoretical here — it still exists for safety if a CDN
// fetch fails at runtime.
const logoResolver: LogoResolver = (c) =>
  c.espnAbbr ? [`https://a.espncdn.com/i/teamlogos/mlb/500/${c.espnAbbr}.png`] : [];

export const mlbConfig: SportConfig = {
  id: 'mlb',
  route: '/mlb',
  name: 'MLB',
  trophyName: 'Commissioner\u2019s Trophy',
  championshipName: 'World Series',
  firstYear: 1903,
  rows: CHAMPIONS,
  // Spot-check milestones: franchise totals that anchor the running-count
  // rollup logic. Keep in sync with milestones.test.ts.
  logoResolver,
  milestones: [
    { franchiseId: 'yankees', expectedCount: 27, throughYear: 2009 },
    { franchiseId: 'cardinals', expectedCount: 11, throughYear: 2011 },
    { franchiseId: 'athletics', expectedCount: 9, throughYear: 1989 },
    { franchiseId: 'red_sox', expectedCount: 9, throughYear: 2018 },
  ],
};
