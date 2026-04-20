import type { LogoResolver, SportConfig } from '../../shared/types';
import { DRIVERS_CHAMPIONS } from './drivers';

// F1 has no reliable public logo CDN for historical constructor names
// (ESPN's F1 endpoints don't cover them), so the resolver always returns
// an empty list and TeamLogo falls straight through to its color-filled
// text-badge tier. This is intentional for the first F1 release.
const logoResolver: LogoResolver = () => [];

export const f1DriversConfig: SportConfig = {
  id: 'f1-drivers',
  route: '/f1/drivers',
  name: 'F1 Drivers',
  trophyName: 'Drivers\u2019 Championship',
  championshipName: 'Drivers\u2019 World Championship',
  firstYear: 1950,
  rows: DRIVERS_CHAMPIONS,
  logoResolver,
  // The Drivers page tracks CAREER driver championships because each
  // row's franchiseId is the driver slug, not a constructor. Keep this
  // list aligned with drivers-milestones.test.ts.
  milestones: [
    { franchiseId: 'hamilton_lewis', expectedCount: 7, throughYear: 2020 },
    { franchiseId: 'schumacher_michael', expectedCount: 7, throughYear: 2004 },
    { franchiseId: 'fangio_juan_manuel', expectedCount: 5, throughYear: 1957 },
    { franchiseId: 'verstappen_max', expectedCount: 4, throughYear: 2024 },
  ],
};
