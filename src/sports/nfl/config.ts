import type { LogoResolver, SportConfig } from '../../shared/types';
import { CHAMPIONS } from './data';

// NFL has no public SVG CDN equivalent to NHL's. ESPN covers all 32
// current teams; historical team names (e.g. "Washington Redskins",
// "Oakland Raiders") resolve to the current-franchise ESPN logo via
// espnAbbr. Text badge covers any 404 (same three-tier idea, just two
// tiers in practice).
const logoResolver: LogoResolver = (c) =>
  c.espnAbbr ? [`https://a.espncdn.com/i/teamlogos/nfl/500/${c.espnAbbr}.png`] : [];

export const nflConfig: SportConfig = {
  id: 'nfl',
  route: '/nfl',
  name: 'NFL',
  trophyName: 'Lombardi Trophy',
  championshipName: 'Super Bowl',
  firstYear: 1966,
  rows: CHAMPIONS,
  logoResolver,
  milestones: [
    { franchiseId: 'steelers', expectedCount: 6, throughYear: 2008 },
    { franchiseId: 'patriots', expectedCount: 6, throughYear: 2018 },
    { franchiseId: '49ers', expectedCount: 5, throughYear: 1994 },
    { franchiseId: 'cowboys', expectedCount: 5, throughYear: 1995 },
  ],
};
