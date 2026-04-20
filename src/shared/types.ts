// Sport-agnostic type surface for the multi-sport shell.
// Individual sports live under src/sports/<id>/ and supply a SportConfig
// that plugs into SportPage. Nothing in this file may reference a
// specific sport.

export interface Champion {
  year: number;
  noChampion: false;
  name: string;
  abbr: string;
  espnAbbr: string | null;
  color: string;
  franchiseId: string;
}

export interface NoChampion {
  year: number;
  noChampion: true;
  reason: string;
}

export type Row = Champion | NoChampion;

/**
 * Ordered list of image URLs to try for a given champion row. TeamLogo
 * walks this list; if every URL errors (or the list is empty), it falls
 * back to a color-filled text badge. The text-badge tier is universal
 * and not part of LogoSource — every sport gets it for free.
 */
export type LogoResolver = (c: Champion) => string[];

export interface Milestone {
  /** franchiseId whose running total we're asserting against */
  franchiseId: string;
  /** Expected running total after the `throughYear` row is counted */
  expectedCount: number;
  /** The last championship year included in the count */
  throughYear: number;
}

export interface SportConfig {
  /** URL-safe identifier, e.g. "nhl", "nfl". Also used as the React key. */
  id: string;
  /** Full route path relative to basename, e.g. "/nhl", "/nfl". */
  route: string;
  /** Short display name, e.g. "NHL". */
  name: string;
  /** Full-length trophy name, e.g. "Stanley Cup". */
  trophyName: string;
  /** Championship event name, e.g. "Stanley Cup Final", "Super Bowl". */
  championshipName: string;
  /** Year of the earliest row in `rows`. Used for the masthead range. */
  firstYear: number;
  /** Chronologically ordered rows. Order matters for running-total rollup. */
  rows: Row[];
  /** Per-sport logo URL builder. Return [] to go straight to text badge. */
  logoResolver: LogoResolver;
  /** Spot-check assertions for the milestone test. */
  milestones: Milestone[];
}
