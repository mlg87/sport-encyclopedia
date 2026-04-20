import type { LogoResolver, SportConfig } from '../../shared/types';
import { CHAMPIONS } from './data';

// EPL has no public team-logo CDN we can reliably hit across 24 clubs
// spanning 136 years of history (including defunct ground sharers and
// pre-1915 kit identities). Return [] for every row so TeamLogo skips
// straight to the text-badge tier, which is designed to render
// indistinguishably well for every era.
const logoResolver: LogoResolver = () => [];

export const eplConfig: SportConfig = {
  id: 'epl',
  route: '/epl',
  name: 'English top flight',
  trophyName: 'English league title',
  championshipName: 'English top-flight championship',
  firstYear: 1889,
  rows: CHAMPIONS,
  logoResolver,
  // Spot-check milestones: franchise totals across the First Division /
  // Premier League era boundary. Man City is the load-bearing case -
  // 2 First Division + 8 Premier League through 2024 must roll up as 10.
  // Keep in sync with milestones.test.ts.
  milestones: [
    { franchiseId: 'man_united', expectedCount: 20, throughYear: 2013 },
    { franchiseId: 'liverpool', expectedCount: 19, throughYear: 2020 },
    { franchiseId: 'arsenal', expectedCount: 13, throughYear: 2004 },
    { franchiseId: 'everton', expectedCount: 9, throughYear: 1987 },
    { franchiseId: 'man_city', expectedCount: 10, throughYear: 2024 },
  ],
};
