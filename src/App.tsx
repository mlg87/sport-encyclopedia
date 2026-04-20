import { SportPage } from './components/SportPage';
import { nhlConfig } from './sports/nhl/config';

export default function App() {
  return (
    <>
      <SportPage sport={nhlConfig} />
      <footer className="colophon">
        <p className="colophon__version">
          {/* Version is injected at build time via vite.config.ts `define`.
              Release notes live on GitHub Releases (there's no CHANGELOG.md
              in the repo — semantic-release publishes notes directly to the
              Releases page to avoid committing back to a protected main). */}
          <a
            className="colophon__version-link"
            href="https://github.com/mlg87/sport-encyclopedia/releases"
            target="_blank"
            rel="noreferrer noopener"
          >
            v{__APP_VERSION__}
          </a>
        </p>
      </footer>
    </>
  );
}
