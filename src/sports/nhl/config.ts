import type { LogoResolver, SportConfig } from '../../shared/types';
import { CHAMPIONS } from './data';

// Preserves the pre-refactor TeamLogo cascade order: ESPN PNG first (when
// espnAbbr is present), then NHL SVG. TeamLogo falls back to a color text
// badge if both error or the list is empty (pre-1915 teams have no modern
// CDN-hosted logo and rely on that badge tier).
const logoResolver: LogoResolver = (c) => {
  const urls: string[] = [];
  if (c.espnAbbr) {
    urls.push(`https://a.espncdn.com/i/teamlogos/nhl/500/${c.espnAbbr}.png`);
  }
  urls.push(`https://assets.nhle.com/logos/nhl/svg/${c.abbr}_dark.svg`);
  return urls;
};

export const nhlConfig: SportConfig = {
  id: 'nhl',
  route: '/nhl',
  name: 'NHL',
  trophyName: 'Stanley Cup',
  championshipName: 'Stanley Cup Final',
  firstYear: 1893,
  rows: CHAMPIONS,
  logoResolver,
  // Spot-check milestones: franchise totals that anchor the running-count
  // rollup logic. Keep in sync with milestones.test.ts.
  milestones: [
    { franchiseId: 'canadiens', expectedCount: 24, throughYear: 1993 },
    { franchiseId: 'toronto', expectedCount: 14, throughYear: 1967 },
    { franchiseId: 'red_wings', expectedCount: 11, throughYear: 2008 },
    { franchiseId: 'panthers', expectedCount: 2, throughYear: 2025 },
  ],
};
