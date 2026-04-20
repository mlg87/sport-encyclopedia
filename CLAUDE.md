# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev              # Vite dev server at http://localhost:5173/sport-encyclopedia/
npm run build            # tsc --noEmit && vite build → dist/
npm run preview          # serve dist/ for prod smoke-testing

npm run lint             # eslint .
npm run lint:fix
npm run format           # prettier --write .
npm run format:check     # must pass in CI

npm test                 # vitest run --coverage (enforces thresholds)
npm run test:watch       # vitest (interactive)
npm run test:a11y        # only tests whose name matches /a11y|accessibility/

npm run commit           # commitizen prompt (conventional commits)
npm run deploy           # manual fallback only — pushes dist/ to gh-pages branch
```

**Single test:** `npx vitest run path/to/file.test.ts` or pattern with
`-t "substring"`. A11y tests are not a separate suite — they live inline
inside `describe('accessibility', ...)` blocks and are filtered by name.

**Coverage thresholds** live in `vite.config.ts` under `test.coverage.thresholds`
(lines 80, functions 80, branches 75, statements 80). Raise as the suite grows.

## Branch protection rules — read this

`main` is protected. The rules here are intentional and have burned the
workflow before; don't work around them:

- No direct commits or pushes to `main`, including admin bypass, `--force`,
  or `--no-verify`. Always work on a feature branch → PR.
- The only required status check is `CI Gate`, which aggregates Lint,
  Prettier, Unit tests + coverage, Accessibility, and Build. Adding or
  renaming jobs doesn't require re-configuring branch protection.
- **If a workflow needs to modify `main`, redesign the workflow so it
  doesn't** — don't loosen the protection. This is why the release
  pipeline no longer commits `CHANGELOG.md` back (see "Release pipeline").

## Architecture

### Multi-sport shell (`src/App.tsx` + `src/sports/registry.ts`)

The site is a React Router app with one route per registered sport:

- `/` → `HomeHub` — grid of tiles, one per sport
- `/:sportId` → `SportPage` parameterized by that sport's `SportConfig`
- Anything else → `NotFound`

`src/sports/registry.ts` exports two lists:

- `SPORTS: SportConfig[]` — active sports that render as linkable tiles on
  the hub and get their own route. Currently NHL and NFL.
- `COMING_SOON: ComingSoonEntry[]` — inert tiles on the hub, one per
  deferred league (NBA, MLB, F1 Drivers, F1 Constructors, EPL). Each will
  get its own follow-up spec under `docs/superpowers/specs/`.

Adding a new sport = create `src/sports/<id>/{data,config,milestones.test}.ts`
and push the config onto `SPORTS`. `SportPage`, `HomeHub`, `TeamLogo`, and
`computeRunningTitleCounts` all consume the generic contract; no component
code needs to change.

### Data model (`src/shared/types.ts`, `src/sports/<id>/data.ts`)

Every row is a discriminated union: either a real champion with a
`franchiseId`, or a `noChampion: true` row with a `reason`. Types live in
`src/shared/types.ts`; per-sport rows live under `src/sports/<id>/data.ts`
typed as `Row[]`.

`franchiseId` is the **only** field that matters for computing running
championship counts. It rolls up through team renames and relocations:

- **NHL:** `toronto` covers Blueshirts → Arenas → St. Patricks → Maple
  Leafs (14 cups); `ottawa_og` covers Silver Seven → original Senators
  (11 cups; the modern 1992+ Senators are a different franchise and
  would need a new id); `canadiens`, `montreal_mar`, `montreal_wan`,
  `montreal_vic`, `montreal_sh`, `montreal_hc` are all distinct because
  Montreal had overlapping clubs.
- **NFL:** `raiders` covers Oakland → LA → Oakland → Las Vegas (3 SBs);
  `rams` covers LA → St. Louis → LA (2 SBs); `colts` covers Baltimore →
  Indianapolis (2 SBs); `commanders` covers Redskins → Washington
  Football Team → Commanders (3 SBs). Per the NFL's own ruling, Browns
  and Ravens are distinct franchises — the Browns' records stayed in
  Cleveland after the 1996 relocation, so `ravens` begins fresh in 1996.

When adding or correcting data, update the matching
`src/sports/<id>/milestones.test.ts`. Both NHL and NFL tests spot-check
four franchise milestones plus, for NFL, the four continuity rollups.

### Running totals (`src/shared/computeTitles.ts`)

`computeRunningTitleCounts(rows)` returns an array parallel to the input,
not a map. `SportPage` walks both in lockstep by index. Keep them aligned
when refactoring — don't sort the dataset at render time.

### Logo loading (`src/components/TeamLogo.tsx` + per-sport `logoResolver`)

`TeamLogo` takes a pre-resolved `sources: string[]` prop and walks it
with `onError` chaining; on total failure (or empty list) it renders a
color-filled text badge keyed by team `color` + `isDark` luma check.

Each sport supplies its own ordered URL builder via
`SportConfig.logoResolver`. `SportPage` calls the resolver per row and
passes the resulting list down to `TeamLogo`.

- **NHL:** `[espnPng, nhlSvg_dark, textBadge]`
- **NFL:** `[espnPng, textBadge]` — no public NFL SVG CDN, so the chain
  is two tiers. Historical team names (Oakland Raiders, Washington
  Redskins) resolve to the current franchise's ESPN logo via `espnAbbr`.

Pre-1915 NHL teams have no `espnAbbr`, so their chain is just
`[nhlSvg_dark, textBadge]` — and since the NHL CDN doesn't have those
old teams either, they always land on the text badge. The `onError`
cascade means the layout never breaks regardless of what's reachable.

### Version injection (footer)

`vite.config.ts` reads `package.json` at config time and injects
`__APP_VERSION__` via Vite's `define`. Ambient declaration is in
`src/vite-env.d.ts`. The footer link points to `/releases` (not a
committed CHANGELOG.md — see release pipeline).

## Release pipeline (`.github/workflows/release-and-deploy.yml`)

**Single combined job** (on push to `main`):

1. `semantic-release` analyzes conventional commits, bumps
   `package.json` version **in the runner's filesystem**, creates the
   git tag, publishes notes to GitHub Releases.
2. `npm run build` runs in the same workspace, so the bumped version is
   baked into `__APP_VERSION__`.
3. `actions/deploy-pages` publishes `dist/`.

The version bump is **never committed back to main**. This is deliberate:
committing back would conflict with branch protection, and GitHub Releases
is already the source of truth for version notes. `@semantic-release/git`
and `@semantic-release/changelog` are intentionally not installed.

`HUSKY=0` is set at the workflow level in both workflows so `npm ci`
doesn't install dev-time git hooks in CI.

## Commit hygiene

- Conventional commits enforced locally by husky's `commit-msg` →
  commitlint. `npm run commit` gives the interactive prompt.
- `body-max-line-length` and `footer-max-line-length` are disabled in
  `commitlint.config.cjs` because semantic-release's auto-generated
  bodies include long markdown links to commits.
- `feat:` → minor version, `fix:` → patch, `feat!:` or a
  `BREAKING CHANGE:` footer → major.

## Deploy URL / repo coupling

Four places hard-code `sport-encyclopedia`:

- `vite.config.ts` `base: '/sport-encyclopedia/'`
- `src/App.tsx` `<BrowserRouter basename="/sport-encyclopedia">`
- `src/App.tsx` footer href
- `README.md` live URL

If the repo is renamed, update all four together — nothing validates
they stay in sync. The `basename` and `base` values must agree or
React Router won't match any route in production.

## GH Pages SPA fallback

Deep links (e.g. `/sport-encyclopedia/nfl`) need to survive a hard reload
on GH Pages. The build script `"postbuild": "cp dist/index.html dist/404.html"`
mirrors `index.html` as `404.html` so GH Pages serves the app shell on
unknown paths; React Router then reads `window.location.pathname` on
mount and renders the right route. The HTTP status is 404 but the content
is correct — fine for a personal-site audience, no SEO impact worth the
complexity of a redirect script.
