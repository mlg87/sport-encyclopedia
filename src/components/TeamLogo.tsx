import { useMemo, useState } from 'react';
import { isDark } from '../shared/isDark';

interface TeamLogoProps {
  abbr: string;
  espnAbbr: string | null;
  color: string;
  name: string;
  size?: number;
}

// Builds a cascading list of candidate logo URLs and renders the first that loads.
// On total failure we render a color-filled text badge so the layout never breaks.
// Order matches the product spec: ESPN → NHL SVG → text badge.
function buildSources(abbr: string, espnAbbr: string | null): string[] {
  const sources: string[] = [];
  if (espnAbbr) {
    sources.push(`https://a.espncdn.com/i/teamlogos/nhl/500/${espnAbbr}.png`);
  }
  sources.push(`https://assets.nhle.com/logos/nhl/svg/${abbr}_dark.svg`);
  return sources;
}

export function TeamLogo({ abbr, espnAbbr, color, name, size = 28 }: TeamLogoProps) {
  const sources = useMemo(() => buildSources(abbr, espnAbbr), [abbr, espnAbbr]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(sources.length === 0);

  if (failed || sourceIndex >= sources.length) {
    const textColor = isDark(color) ? '#ffffff' : '#1a1a1a';
    return (
      <span
        className="team-badge"
        style={{ background: color, color: textColor, width: size, height: size }}
        aria-label={`${name} logo`}
      >
        {abbr}
      </span>
    );
  }

  return (
    <img
      className="team-logo"
      src={sources[sourceIndex]}
      alt={`${name} logo`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (sourceIndex + 1 < sources.length) {
          setSourceIndex(sourceIndex + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
