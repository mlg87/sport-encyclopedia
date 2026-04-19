# Stanley Cup Champions · 1893–2025

A minimal, mobile-first React + TypeScript site that lists every Stanley Cup
champion from 1893 through 2025, grouped by decade, with running franchise-level
cup totals (name changes roll up — Toronto's count spans Blueshirts → Arenas →
St. Patricks → Maple Leafs).

Live: https://mlg87.github.io/sport-encyclopedia/

## Stack

- Vite + React 18 + TypeScript
- Zero runtime UI dependencies beyond React
- DM Sans + DM Mono via Google Fonts
- Single stylesheet, no CSS framework

## Develop

```sh
npm install
npm run dev
```

## Commits, releases, and deploys

This repo uses conventional commits to drive automated semantic-versioned
releases. The footer of the site links to the repo's **Releases** page,
where semantic-release publishes per-version notes.

**Committing.** A Husky `commit-msg` hook runs commitlint on every message,
so non-conventional commits are rejected locally. Use `npm run commit` to get
the interactive Commitizen prompt if you want help structuring one.

**Releases + deploy.** On every merge to `main`,
`.github/workflows/release-and-deploy.yml` runs one combined job that:

1. Runs `semantic-release`, which:
   - Analyzes commits since the last tag
   - Computes the next semver version (`feat:` → minor, `fix:` → patch, `!:` →
     major)
   - Bumps `package.json` **in the runner only** (it's never committed back —
     `main` is branch-protected and semantic-release isn't a bypass actor)
   - Creates the git tag and publishes release notes to **GitHub Releases**
2. Runs `npm run build`, which reads the now-bumped `package.json` and
   injects `__APP_VERSION__` into the bundle via `vite.config.ts` `define`
3. Uploads `dist/` and publishes to GitHub Pages via `actions/deploy-pages`

Because release and deploy share one job, the in-memory version bump flows
straight into the deployed artifact without a round-trip through `main`.

There's also a manual fallback: `npm run deploy` pushes `dist/` to the
`gh-pages` branch using the `gh-pages` package.

### One-time GitHub setup

In the repo settings:

- **Pages** → Source: **GitHub Actions** (the workflow uploads artifacts
  rather than committing to `gh-pages`)
- **Actions** → Workflow permissions: **Read and write permissions**
  (semantic-release needs to push the version commit and create releases)
- **Branches** → Branch protection rule for `main`:
  - Require a pull request before merging
  - Require status checks to pass → select **`CI Gate`** (and only `CI Gate`)

## PR quality gate

`.github/workflows/pr.yml` runs these jobs in parallel on every PR:

| Job                     | What it checks                                                          |
| ----------------------- | ----------------------------------------------------------------------- |
| `Lint`                  | `eslint .` — including `jsx-a11y` rules                                 |
| `Prettier`              | `prettier --check .`                                                    |
| `Unit tests + coverage` | `vitest run --coverage` — fails if thresholds not met                   |
| `Accessibility`         | axe-core tests via `vitest-axe` (tests named `a11y` or `accessibility`) |
| `Build`                 | `tsc --noEmit && vite build`                                            |

A final `CI Gate` job depends on all of them and fails unless every upstream
job succeeded. This is the single status check to mark **Required** in branch
protection — adding or renaming jobs doesn't require re-configuring branch
protection.

Coverage thresholds (enforced in `vite.config.ts`): lines 80, functions 80,
branches 75, statements 80. Raise as the suite grows.

## Data & logos

All champion data lives in `src/data.ts` as a typed array. Each entry carries
a `franchiseId` used to roll running totals across renames. Two "no champion"
entries (1919 influenza, 2005 lockout) render as muted italic rows.

Team logos are loaded from ESPN and NHL CDNs with a colored abbreviation
badge as a final fallback, so the layout survives any logo source going down
or a pre-1915 team with no canonical logo.
