import { useState } from 'react';
import { isDark } from '../shared/isDark';

interface TeamLogoProps {
  /** Ordered list of image URLs to try. On total failure, or when empty,
      the component renders a color-filled text badge. Callers build this
      list via their sport's logoResolver. */
  sources: string[];
  color: string;
  name: string;
  abbr: string;
  size?: number;
}

export function TeamLogo({ sources, color, name, abbr, size = 28 }: TeamLogoProps) {
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
