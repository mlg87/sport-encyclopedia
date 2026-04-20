import type { LogoResolver, SportConfig } from '../../shared/types';
import { CONSTRUCTORS_CHAMPIONS } from './constructors';

// F1 constructors share the Drivers page's logo story: no reliable public
// logo CDN for historical team names, so the resolver returns [] and the
// TeamLogo cascade renders a color-filled text badge.
const logoResolver: LogoResolver = () => [];

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
