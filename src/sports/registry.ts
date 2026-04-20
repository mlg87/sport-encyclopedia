import type { SportConfig } from '../shared/types';
import { nhlConfig } from './nhl/config';
import { nflConfig } from './nfl/config';
import { nbaConfig } from './nba/config';
import { mlbConfig } from './mlb/config';
import { f1DriversConfig } from './f1/drivers-config';
import { f1ConstructorsConfig } from './f1/constructors-config';

/** Active, user-visible sports. Ordered by launch date — NHL was the
    original, NFL proved out the multi-sport refactor, NBA and MLB
    completed the "big four" North American leagues, and F1 extends the
    shell to international motorsport. F1 ships as two distinct configs
    (drivers and constructors) sharing the src/sports/f1/ folder, since
    F1 awards two separate world championships each season. */
export const SPORTS: SportConfig[] = [
  nhlConfig,
  nflConfig,
  nbaConfig,
  mlbConfig,
  f1DriversConfig,
  f1ConstructorsConfig,
];

/** Deferred leagues rendered as inert tiles on the home hub. Each entry
    will become a full SportConfig in its own follow-up spec. */
export interface ComingSoonEntry {
  id: string;
  name: string;
  championshipName: string;
}

export const COMING_SOON: ComingSoonEntry[] = [
  { id: 'epl', name: 'English top flight', championshipName: 'League title' },
];
