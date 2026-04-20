import type { SportConfig } from '../shared/types';
import { nhlConfig } from './nhl/config';
import { nflConfig } from './nfl/config';
import { nbaConfig } from './nba/config';
import { mlbConfig } from './mlb/config';
import { f1DriversConfig } from './f1/drivers-config';
import { f1ConstructorsConfig } from './f1/constructors-config';
import { eplConfig } from './epl/config';

/** Active, user-visible sports. Ordered by launch date - NHL was the
    original, NFL proved out the multi-sport refactor, NBA and MLB
    completed the "big four" North American leagues, F1 extended the
    shell to international motorsport, and EPL closes out the planned
    lineup with English top-flight football. F1 ships as two distinct
    configs (drivers and constructors) sharing the src/sports/f1/ folder
    since F1 awards two separate world championships each season. */
export const SPORTS: SportConfig[] = [
  nhlConfig,
  nflConfig,
  nbaConfig,
  mlbConfig,
  f1DriversConfig,
  f1ConstructorsConfig,
  eplConfig,
];

/** Deferred leagues rendered as inert tiles on the home hub. Each entry
    will become a full SportConfig in its own follow-up spec. The list
    is now empty - all seven sports in the original multi-sport plan are
    live. Kept as an export so HomeHub's existing prop contract and the
    ghost-tile rendering path stay intact for any future additions. */
export interface ComingSoonEntry {
  id: string;
  name: string;
  championshipName: string;
}

export const COMING_SOON: ComingSoonEntry[] = [];
