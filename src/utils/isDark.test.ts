import { describe, it, expect } from 'vitest';
import { isDark } from './isDark';

describe('isDark', () => {
  it('identifies pure black as dark', () => {
    expect(isDark('#000000')).toBe(true);
  });

  it('identifies pure white as light', () => {
    expect(isDark('#ffffff')).toBe(false);
  });

  it('treats canonical team navy/reds as dark', () => {
    expect(isDark('#AF1E2D')).toBe(true); // Canadiens red
    expect(isDark('#0038A8')).toBe(true); // Rangers blue
    expect(isDark('#002F87')).toBe(true); // Blues navy
  });

  it('treats bright yellows/oranges as light', () => {
    // Boston gold and Pittsburgh gold are light enough that white text
    // would fail contrast — badge text should render dark on these.
    expect(isDark('#FFB81C')).toBe(false);
    expect(isDark('#FCB514')).toBe(false);
  });

  it('accepts hex without leading hash', () => {
    expect(isDark('000000')).toBe(true);
    expect(isDark('ffffff')).toBe(false);
  });

  it('returns true for malformed input as a safe default', () => {
    // Better to render white-on-unknown than to crash a logo fallback render.
    expect(isDark('nope')).toBe(true);
  });
});
