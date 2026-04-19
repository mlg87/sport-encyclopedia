import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as axeMatchers from 'vitest-axe/matchers';

// Register axe + jest-dom matchers so `expect(...).toHaveNoViolations()` and
// `.toBeInTheDocument()` style matchers are available in every test.
expect.extend(axeMatchers);

afterEach(() => {
  cleanup();
});

// ChampionRow uses IntersectionObserver for its scroll-in fade. jsdom doesn't
// ship one, so we stub a no-op. Tests that care about visibility can override.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  observe(): void {}
  disconnect(): void {}
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver;

// prefers-reduced-motion query is used by ChampionRow; default to "not reduced"
// so the scroll-in path runs normally in tests. A test can override matchMedia
// per-case if needed.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
