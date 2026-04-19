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

### Data model (`src/data.ts`)

Every champion row is a discriminated union: either a real champion with a
`franchiseId`, or a `noChampion: true` row with a `reason`. The dataset
spans three eras (Challenge, Interleague, NHL) but the rendering code
doesn't distinguish them — eras are purely editorial grouping in the file.

`franchiseId` is the **only** field that matters for computing running
cup counts. It rolls up through team renames:

- `toronto` covers Blueshirts → Arenas → St. Patricks → Maple Leafs (14 cups)
- `ottawa_og` covers Silver Seven → original Senators (11 cups; the
  modern 1992+ Senators are a different franchise and would need a new id)
- `canadiens`, `montreal_mar`, `montreal_wan`, `montreal_vic`, `montreal_sh`,
  `montreal_hc` are all distinct — Montreal had overlapping clubs.

When adding champions or correcting data, the test in
`src/utils/computeCups.test.ts` spot-checks four franchise milestones.
Update both the data and the milestones together.

### Running totals (`src/utils/computeCups.ts`)

`computeRunningCupCounts` returns an array parallel to `CHAMPIONS`, not a
map. `App.tsx` walks both in lockstep by index. Keep them aligned when
refactoring — don't sort `CHAMPIONS` at rendering time.

### Logo loading (`src/components/TeamLogo.tsx`)

Three-tier fallback, attempted in order:

1. ESPN PNG (`espnAbbr` present in data)
2. NHL SVG (`abbr` with `_dark` suffix)
3. Text badge: rounded square filled with team `color`, abbreviation in
   black or white chosen by `isDark` (Rec. 601 luma heuristic).

Pre-1915 teams only have the text badge tier — their logos don't exist
on any modern CDN. The `onError` cascade means the layout never breaks
regardless of what's reachable.

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

Two places hard-code `sport-encyclopedia`:

- `vite.config.ts` `base: '/sport-encyclopedia/'`
- `src/App.tsx` footer href
- `README.md` live URL

If the repo is renamed, update all three together — nothing validates
they stay in sync.
