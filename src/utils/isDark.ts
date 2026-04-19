// Perceptual luminance check (sRGB-ish). True = color is dark enough that
// white foreground text is readable. Used for text badge fallbacks.
export function isDark(hex: string): boolean {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return true;
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  // Rec. 601 luma — cheap and close enough for contrast checks on small badges.
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return luma < 160;
}
