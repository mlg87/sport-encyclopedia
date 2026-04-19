import { useEffect, useRef, useState } from 'react';
import type { Champion } from '../data';
import { TeamLogo } from './TeamLogo';
import { TrophyIcon } from './TrophyIcon';

interface ChampionRowProps {
  champion: Champion;
  cupCount: number;
  index: number;
}

// Threshold at which we stop rendering individual trophy icons and collapse to
// "icon × N". Keeps the right-hand column from overflowing on narrow phones
// once a franchise has more than five cups.
const TROPHY_INLINE_LIMIT = 5;

export function ChampionRow({ champion, cupCount, index }: ChampionRowProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // Respect reduced-motion: show immediately with no fade-in for users who
    // have it enabled, per WCAG 2.3.3.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Stagger per-row fade-in. Capped so long scrolls don't feel laggy.
  const delayMs = Math.min((index % 10) * 35, 350);

  if (champion.noChampion) {
    return (
      <div
        ref={ref}
        className={`row row--empty${visible ? ' row--visible' : ''}`}
        style={{ transitionDelay: `${delayMs}ms` }}
      >
        <span className="row__year">{champion.year}</span>
        <span className="row__accent row__accent--empty" aria-hidden="true" />
        <span className="row__body">
          <em>No champion — {champion.reason}</em>
        </span>
      </div>
    );
  }

  const renderTrophies = () => {
    // `role="img"` is required to pair with `aria-label` on a <span> — axe
    // (and WAI-ARIA 1.2) prohibits aria-label on generic elements because
    // the label has no accessible role to attach to.
    if (cupCount <= TROPHY_INLINE_LIMIT) {
      return (
        <span
          className="row__trophies"
          role="img"
          aria-label={`${cupCount} cup${cupCount === 1 ? '' : 's'}`}
        >
          {Array.from({ length: cupCount }, (_, i) => (
            <TrophyIcon key={i} />
          ))}
        </span>
      );
    }
    return (
      <span className="row__trophies" role="img" aria-label={`${cupCount} cups`}>
        <TrophyIcon />
        <span aria-hidden="true" className="row__trophy-count">
          ×{cupCount}
        </span>
      </span>
    );
  };

  return (
    <div
      ref={ref}
      className={`row${visible ? ' row--visible' : ''}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <span className="row__year">{champion.year}</span>
      <span className="row__accent" style={{ background: champion.color }} aria-hidden="true" />
      <span className="row__logo">
        <TeamLogo
          abbr={champion.abbr}
          espnAbbr={champion.espnAbbr}
          color={champion.color}
          name={champion.name}
        />
      </span>
      <span className="row__body">
        <span className="row__name">{champion.name}</span>
        {renderTrophies()}
      </span>
    </div>
  );
}
