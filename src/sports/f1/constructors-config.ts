import type { LogoResolver, SportConfig } from '../../shared/types';
import { CONSTRUCTORS_CHAMPIONS } from './constructors';

// Formula1.com hosts team logos at a stable DAM path keyed by team
// slug: https://media.formula1.com/content/dam/fom-website/teams/2025/<slug>-logo.png
// Only teams currently on the grid have logos there, so the map only
// covers franchiseIds still competing (ferrari/mclaren/mercedes/
// red_bull/williams). Defunct or one-off championship constructors
// (vanwall, cooper, brm, lotus, brabham, matra, tyrrell, benetton,
// renault-the-2005-factory-team, brawn) have no modern logo and fall
// through to TeamLogo's text-badge tier - the dataset's per-row color
// still carries the visual identity.
const F1_LOGO_BY_FRANCHISE: Record<string, string> = {
  ferrari: 'ferrari',
  mclaren: 'mclaren',
  mercedes: 'mercedes',
  red_bull: 'red-bull-racing',
  williams: 'williams',
};

const logoResolver: LogoResolver = (c) => {
  const slug = F1_LOGO_BY_FRANCHISE[c.franchiseId];
  return slug
    ? [`https://media.formula1.com/content/dam/fom-website/teams/2025/${slug}-logo.png`]
    : [];
};

export const f1ConstructorsConfig: SportConfig = {
  id: 'f1-constructors',
  route: '/f1/constructors',
  name: 'F1 Constructors',
  trophyName: 'Constructors\u2019 Championship',
  championshipName: 'Constructors\u2019 World Championship',
  firstYear: 1958,
  rows: CONSTRUCTORS_CHAMPIONS,
  logoResolver,
  // Milestones chosen to anchor the two biggest rollups (Ferrari, Williams)
  // plus McLaren's 2024 reset-to-relevance and Mercedes' Hamilton-era
  // dynasty. Keep in sync with constructors-milestones.test.ts.
  milestones: [
    { franchiseId: 'ferrari', expectedCount: 16, throughYear: 2008 },
    { franchiseId: 'williams', expectedCount: 9, throughYear: 1997 },
    { franchiseId: 'mclaren', expectedCount: 9, throughYear: 2024 },
    { franchiseId: 'mercedes', expectedCount: 7, throughYear: 2020 },
  ],
};
