/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Read the version from package.json at config time so we can inject it as a
// compile-time constant. Using a file read rather than an import keeps the
// final bundle free of the rest of package.json.
const pkg: { version: string } = JSON.parse(
  readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8'),
);

// Base path matches the repo name for GitHub Pages.
// Update here if the repo is ever renamed.
export default defineConfig({
  plugins: [react()],
  base: '/sport-encyclopedia/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/vite-env.d.ts', 'src/data.ts', 'src/**/*.test.{ts,tsx}'],
      // Coverage thresholds are enforced in CI — failing these blocks the PR
      // gate. Starting numbers reflect what's achievable on the initial suite;
      // raise as coverage grows.
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
