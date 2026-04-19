/// <reference types="vite/client" />

// File is a module (has an import below), so `__APP_VERSION__` must live
// inside `declare global` to remain an ambient global. Injected at build
// time by vite.config.ts from package.json.version.
declare global {
  const __APP_VERSION__: string;
}

// vitest-axe ships matchers but no ambient type augmentation for Vitest's
// Assertion interface. Without this, TypeScript can't see `toHaveNoViolations`
// on `expect(...)` even though the runtime matcher is registered in
// vitest.setup.ts. Follow the jest-axe pattern: augment the `vitest` module.
import 'vitest';
declare module 'vitest' {
  interface Assertion<T = unknown> {
    toHaveNoViolations: () => T;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations: () => unknown;
  }
}
