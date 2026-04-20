import type { SportConfig } from '../shared/types';
import { nhlConfig } from './nhl/config';

/** Active, user-visible sports. Ordered by launch date — NHL is the original,
    NFL is the proof league for the multi-sport refactor. */
export const SPORTS: SportConfig[] = [nhlConfig];

/** Deferred leagues rendered as inert tiles on the home hub. Each entry
    will become a full SportConfig in its own follow-up spec. */
export interface ComingSoonEntry {
  id: string;
  name: string;
  championshipName: string;
}

export const COMING_SOON: ComingSoonEntry[] = [
  { id: 'nba', name: 'NBA', championshipName: 'NBA Finals' },
  { id: 'mlb', name: 'MLB', championshipName: 'World Series' },
  { id: 'f1-drivers', name: 'F1 Drivers', championshipName: 'Drivers\u2019 Championship' },
  {
    id: 'f1-constructors',
    name: 'F1 Constructors',
    championshipName: 'Constructors\u2019 Championship',
  },
  { id: 'epl', name: 'English top flight', championshipName: 'League title' },
];
