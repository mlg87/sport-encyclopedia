import type { SportConfig } from '../shared/types';
import { nhlConfig } from './nhl/config';
import { nflConfig } from './nfl/config';
import { nbaConfig } from './nba/config';

/** Active, user-visible sports. Ordered by launch date — NHL is the original,
    NFL is the proof league for the multi-sport refactor, NBA is the third
    sport onboarded against the same SportConfig contract. */
export const SPORTS: SportConfig[] = [nhlConfig, nflConfig, nbaConfig];

/** Deferred leagues rendered as inert tiles on the home hub. Each entry
    will become a full SportConfig in its own follow-up spec. */
export interface ComingSoonEntry {
  id: string;
  name: string;
  championshipName: string;
}

export const COMING_SOON: ComingSoonEntry[] = [
  { id: 'mlb', name: 'MLB', championshipName: 'World Series' },
  { id: 'f1-drivers', name: 'F1 Drivers', championshipName: 'Drivers\u2019 Championship' },
  {
    id: 'f1-constructors',
    name: 'F1 Constructors',
    championshipName: 'Constructors\u2019 Championship',
  },
  { id: 'epl', name: 'English top flight', championshipName: 'League title' },
];
