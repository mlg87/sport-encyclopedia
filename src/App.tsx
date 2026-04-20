import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { SportPage } from './components/SportPage';
import { HomeHub } from './components/HomeHub';
import { SPORTS, COMING_SOON } from './sports/registry';

export default function App() {
  return (
    <BrowserRouter basename="/sport-encyclopedia">
      <Routes>
        <Route path="/" element={<HomeHub sports={SPORTS} comingSoon={COMING_SOON} />} />
        {SPORTS.map((s) => (
          <Route key={s.id} path={s.route} element={<SportPage sport={s} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="colophon">
        <p className="colophon__version">
          {/* Version is injected at build time via vite.config.ts `define`.
              Release notes live on GitHub Releases — semantic-release publishes
              notes there instead of committing CHANGELOG.md back to a protected
              main branch. */}
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
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="page">
      <header className="masthead">
        <h1 className="masthead__title">Not found</h1>
        <p className="masthead__blurb">
          <Link to="/">Back to the hub</Link>
        </p>
      </header>
    </div>
  );
}
