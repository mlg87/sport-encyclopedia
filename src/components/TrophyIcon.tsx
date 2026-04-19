interface TrophyIconProps {
  size?: number;
  color?: string;
  title?: string;
}

// Simple cup-with-handles-and-base trophy used to represent one cup won.
// Intentionally muted by default so a row of five still reads as texture, not noise.
export function TrophyIcon({ size = 11, color = '#c5c5c5', title }: TrophyIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path
        fill={color}
        d="M7 3h10v3a5 5 0 0 1-4 4.9V14h3v2H8v-2h3v-3.1A5 5 0 0 1 7 6V3Zm-3 1h2v2a3 3 0 0 1-2 2.83V4Zm14 0h2v4.83A3 3 0 0 1 18 6V4ZM7 18h10v2H7v-2Z"
      />
    </svg>
  );
}
