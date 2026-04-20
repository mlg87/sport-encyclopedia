# Multi-sport expansion — design

**Status:** approved for planning
**Date:** 2026-04-19
**Scope of this spec:** architectural refactor + NFL as proof-of-concept
**Explicitly deferred to later specs:** NBA, MLB, F1 (Drivers + Constructors), EPL

---

## Context

The site currently renders a single-sport (NHL / Stanley Cup) encyclopedia as a
scrollable year-by-year list with sticky decade chips, a team filter, a sort
toggle, and running cup counts per franchise. It has been well received and the
user wants to expand it to cover five more league-level championships.

Because the codebase is structured around NHL-specific assumptions
(`CHAMPIONS` at the top of `src/data.ts`, `computeRunningCupCounts` phrased in
"cups", a hardcoded three-tier logo cascade in `TeamLogo.tsx`, a single-page
shell in `App.tsx`), adding five more leagues without generalizing the model
would duplicate these assumptions five times over. This spec introduces the
shared scaffolding, proves it with one additional league (NFL), and leaves the
remaining four leagues to follow-up specs that each plug into the scaffold.

## Decisions (already agreed during brainstorming)

| #   | Decision                                                                                                                                                                                                                                                                                                                | Rationale                                                                                                                                                                                                                                                                                                                                        |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **IA: home hub + per-sport routes** (option B). `/` → hub, `/<sport>` → per-sport page.                                                                                                                                                                                                                                 | Scales to 6+ leagues; shareable URLs; F1's Drivers/Constructors split has a natural home as `/f1/drivers` and `/f1/constructors`. Rejected: unified cross-sport timeline (mixes unrelated things, awkward running totals), sport-switcher tabs (doesn't scale visually).                                                                         |
| 2   | **Launch strategy: refactor + one proof league, then the rest** (option C).                                                                                                                                                                                                                                             | Validates the abstraction against a genuinely non-NHL dataset before committing four more data sets to it. NFL chosen as the proof because its shape (team-based, one champion per year, franchise relocations) is closest to NHL — catches abstraction holes without also fighting F1's dual-championship or EPL's era-rename at the same time. |
| 3   | **League scope defaults accepted:** NFL = Super Bowl era only (1966 season→); NBA = NBA+BAA (1946–47→); MLB = World Series era (1903→); F1 = both Drivers (1950→) and Constructors (1958→) as separate routes; EPL = English top-flight champions (1888→), badged "First Division" pre-1992 and "Premier League" 1992+. | Matches how each league officially counts its championships; EPL's pre-1992 titles are included because e.g. Man United's canonical "20 league titles" spans both eras.                                                                                                                                                                          |

## Non-goals

- Cross-sport views, unified timelines, or "what happened in year X across
  every sport" (explicitly rejected during brainstorming).
- Visual redesign of the per-sport page — current look is preserved.
- Adding NBA/MLB/F1/EPL data in _this_ spec. Each gets its own follow-up spec.
- Internationalization, accounts, favorites, or any persistence.

## Architecture

### Folder layout after refactor

```
src/
  sports/
    registry.ts            # exports SPORTS: SportConfig[]
    nhl/
      data.ts              # moved from src/data.ts
      config.ts            # NHL SportConfig
      milestones.test.ts   # moved from utils/computeCups.test.ts
    nfl/
      data.ts              # new — Super Bowl era champions
      config.ts
      milestones.test.ts
  shared/
    types.ts               # Champion, NoChampion, Row, SportConfig, LogoSource
    computeTitles.ts       # generalized computeRunningCupCounts (renamed)
    viewModel.ts           # moved from src/utils/; already sport-agnostic
    isDark.ts              # moved from src/utils/
  components/
    SportPage.tsx          # the current App body, parameterized by SportConfig
    HomeHub.tsx             # landing grid
    TeamLogo.tsx           # uses sport.logoResolver
    ChampionRow.tsx        # unchanged
    DecadeGroup.tsx        # unchanged
    TrophyIcon.tsx         # unchanged (but accepts a trophy-name prop)
    nav/ DecadeChips.tsx   # unchanged
    toolbar/ *             # unchanged
  App.tsx                  # <BrowserRouter basename="/sport-encyclopedia">,
                           #   <Routes> { "/" → HomeHub, "/:sportId" → SportPage }
  main.tsx                 # unchanged
```

### Why this shape

- **One folder per sport** keeps the 1,200-line NHL dataset and its tests
  physically co-located with the config that consumes it. When a future
  contributor adds NBA data, they touch exactly one directory.
- **`shared/` for types and pure logic** moves the generic bits out of
  `utils/` (which was implicitly "NHL utils") and signals that anything in
  `shared/` must not reference a specific sport.
- **`SportPage` parameterized by `SportConfig`** means the visual design the
  user likes today is preserved — it's literally the same render tree, just
  fed by a config object instead of a module-level import.

## Data model

### Generalized types (`shared/types.ts`)

```ts
export type Champion = {
  year: number;
  franchiseId: string;
  displayName: string;
  color?: string;
  abbr?: string;
  espnAbbr?: string;
};

export type NoChampion = {
  year: number;
  noChampion: true;
  reason: string;
};

export type Row = Champion | NoChampion;

export type LogoSource = { kind: 'img'; url: string } | { kind: 'textBadge' };

export type LogoResolver = (c: Champion) => LogoSource[];

export type Milestone = {
  franchiseId: string;
  expectedCount: number;
  throughYear: number;
};

export type SportConfig = {
  id: string; // "nhl", "nfl"
  route: string; // "/nhl", "/nfl"
  name: string; // "NHL"
  trophyName: string; // "Stanley Cup", "Lombardi Trophy"
  championshipName: string; // "Stanley Cup Final", "Super Bowl"
  firstYear: number;
  rows: Row[];
  logoResolver: LogoResolver;
  milestones: Milestone[];
};
```

`franchiseId` keeps its current role as the **sole** key for running-title
totals — the invariant CLAUDE.md already calls out. All team-renames and
relocations roll up through it.

### Running totals — renaming and generalizing

`src/utils/computeCups.ts` → `src/shared/computeTitles.ts`. The signature
stays array-parallel-to-input (CLAUDE.md calls this out explicitly; App walks
both in lockstep by index). Only the symbol name changes:

```ts
export function computeRunningTitleCounts(rows: Row[]): number[];
```

`App.tsx`'s existing reference updates to the new name. Behavior unchanged.

### Logo resolver (pluggable)

Today `TeamLogo.tsx` hardcodes a three-tier ESPN → NHL-SVG → text-badge
cascade. Refactor:

- `TeamLogo` takes a `LogoSource[]` (already resolved by the sport's
  `logoResolver`) and walks it with the same `onError` chaining as today.
- `textBadge` remains the universal final tier — computed inside `TeamLogo`
  from the `Champion`'s `color` + `displayName` + the Rec. 601 luma check in
  `isDark.ts`. The config only _declares_ that a text badge is acceptable
  (which in practice every sport will).
- Per-sport cascades:
  - **NHL:** `[espnPng(espnAbbr), nhlSvg(abbr + '_dark'), textBadge]`
  - **NFL:** `[espnPng(espnAbbr), textBadge]` (no NFL CDN equivalent of the
    NHL SVG endpoint; ESPN covers all 32 current teams, text badge covers
    relocated/renamed franchises if a logo 404s).

Pre-1915 NHL rows already rely on the text-badge tier today; that behavior
is preserved bit-for-bit.

## Routing

- Add `react-router-dom` (v6+).
- `App.tsx` wraps the app in `<BrowserRouter basename="/sport-encyclopedia">`.
  The basename matches `vite.config.ts`'s `base: '/sport-encyclopedia/'` so
  GH Pages routing continues to work.
- Routes:
  - `/` → `<HomeHub sports={SPORTS} />`
  - `/:sportId` → lookup in `SPORTS`; render `<SportPage sport={...} />` or
    a 404-style fallback.
- **No client-side-only routing gotcha on GH Pages:** the site is a
  single-entry SPA; deep links work because all paths serve `index.html`
  via GH Pages' SPA fallback (already in use — confirm no extra `404.html`
  redirect is needed as part of implementation).

## Home hub (`/`)

- Grid of tiles, one per entry in `SPORTS` plus ghost "Coming soon" tiles
  for league ids listed in a `COMING_SOON` constant (initial value:
  `['nba', 'mlb', 'f1-drivers', 'f1-constructors', 'epl']`). Ghost tiles
  are not links and are visually de-emphasized.
- Each active tile shows: trophy icon, sport name, championship name, year
  range (`firstYear – most recent row year`), most recent champion's display
  name. Read directly from `SportConfig`.
- Tile click routes to the sport.
- The site footer (currently in `App.tsx`) moves up to `App.tsx`'s top-level
  layout so it's shared across `/` and `/:sportId`. Version string still
  comes from `__APP_VERSION__`.

## NFL specifics

- **Era:** Super Bowl I (1966 season, played Jan 1967) through most recent
  completed season. Each row's `year` = the season year (NFL convention),
  not the calendar year the game was played.
- **Franchise continuity rules** (examples; full list in `nfl/data.ts`):
  - `las_vegas_raiders` — Oakland → LA → Oakland → Las Vegas (one franchise)
  - `la_rams` — LA → St. Louis → LA (one franchise)
  - `washington_commanders` — Redskins → Football Team → Commanders
  - **Browns / Ravens are distinct franchises** (NFL's official ruling when
    the team relocated in 1996 — the Browns' records stayed in Cleveland).
- **Logo data:** `espnAbbr` for each current team (ESPN serves all 32).
- **Milestones test** (`nfl/milestones.test.ts`), through the 2024 season:
  - Steelers — 6
  - Patriots — 6
  - 49ers — 5
  - Cowboys — 5
- **Color data:** team primary colors for text-badge fallback. Source: team
  style guides / Wikipedia team infoboxes; record source in a comment if
  a color is disputed.

## Testing

- Existing NHL tests (`App.test.tsx`, `ChampionRow.test.tsx`,
  `computeCups.test.ts`, `isDark.test.ts`, `viewModel.test.ts`) move with
  the code they test; imports update; no assertion changes.
- `computeCups.test.ts` → `computeTitles.test.ts` alongside the renamed
  module. The four NHL milestone assertions stay exactly as they are,
  expressed against the moved NHL data.
- New NFL milestone test (four franchises, see above).
- New `HomeHub.test.tsx`:
  - Renders one tile per active sport in `SPORTS`.
  - Clicking a tile navigates to the sport's route
    (`MemoryRouter` in tests).
  - Ghost tiles render but are not links.
- New `SportPage.test.tsx` (thin): renders for both NHL and NFL with a
  passed-in config, asserts the headline championship name appears.
- **Coverage thresholds** in `vite.config.ts` stay at 80/80/75/80. The
  refactor must leave them green. Raise thresholds in a follow-up once the
  additional leagues have landed.
- **a11y tests** (the inline `describe('accessibility', ...)` blocks)
  extend to `HomeHub` and `SportPage` — hub grid must be keyboard
  navigable, tile semantics must be correct (`<a>` not `<div onClick>`).

## CI / release pipeline

No changes required. The existing `CI Gate` check aggregates Lint,
Prettier, Unit tests + coverage, Accessibility, and Build — all of which
naturally pick up the new files. `semantic-release` continues to bump
version based on conventional commits; this refactor commits as
`feat(sports): generalize data model to support multiple leagues`
(a minor bump — the public UI gains a new section).

**Explicitly unchanged** (per CLAUDE.md's release-pipeline notes): no
commit-back-to-main, no CHANGELOG.md, no admin bypass, no loosened branch
protection. `HUSKY=0` stays set in workflows.

## Repo name / base-path coupling

The three `sport-encyclopedia`-hardcoded locations called out in CLAUDE.md
remain hardcoded. Add a brief note in CLAUDE.md's "Deploy URL / repo
coupling" section that the React Router `basename` is a fourth location
that must stay in sync.

## Rollout plan for this spec

One PR: `feat/multi-sport-refactor-and-nfl`. Contains:

1. The folder reshuffle (moves tracked as renames where possible so git
   blame survives).
2. Generalized types, `computeTitles` rename, `TeamLogo` logo-resolver
   refactor.
3. Routing, `HomeHub`, `SportPage`.
4. NFL dataset + config + tests.
5. CLAUDE.md edit for the `basename` coupling note.

All existing NHL behavior must be preserved. The refactor is visually a
no-op on the NHL page (aside from the URL now being `/nhl` instead of
`/`, and the footer moving up one level).

## Followup specs (not in this spec)

Each of these will reuse the scaffold and add a new entry to `SPORTS`:

- **NBA** — straightforward; includes BAA; Lakers Minneapolis→LA franchise
  rollup; ABA explicitly excluded per decision #3.
- **MLB** — straightforward; includes all 19th-century-founded franchise
  rollups (Braves Boston→Milwaukee→Atlanta; Dodgers Brooklyn→LA; Giants
  NY→SF).
- **F1** — introduces two routes (`/f1/drivers`, `/f1/constructors`) as
  two distinct entries in `SPORTS` sharing assets. First league where a
  "champion" is an individual, not a team — may require a small extension
  to `Champion` (a `subtitle` field for the winning constructor on the
  drivers page, and vice versa). Will be designed fully in its own spec.
- **EPL** — introduces a competition-name era switch (First Division
  pre-1992, Premier League 1992+). Probably handled by a per-row
  `competitionLabel` field or a derivation from `year`.

The F1 and EPL specs will stress-test whether `Champion` needs additional
optional fields; if so, those additions happen in the F1/EPL specs, not
preemptively here.

## Open items (decide during implementation planning)

- Exact NFL franchise-id naming convention (hyphens vs underscores;
  current NHL data uses underscores — match that).
- Whether `HomeHub` tiles show the running champion count too, or just
  the most recent champion. Default: just most recent; running count
  would duplicate what the sport page shows.
- Whether a ghost tile links somewhere (e.g., a GitHub issue for that
  league) or is inert. Default: inert, with a small "Coming soon" label.
