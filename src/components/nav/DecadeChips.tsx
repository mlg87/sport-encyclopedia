import { useEffect, useRef } from 'react';
import { useActiveDecade, scrollToDecade } from './useActiveDecade';

interface DecadeChipsProps {
  decades: number[];
}

// Option 1 — Sticky chips.
// Horizontal scroll of decade pills pinned to the top of the viewport.
// Active chip reflects the decade the reader is currently inside, and the
// strip auto-scrolls horizontally so the active chip stays in view.
export function DecadeChips({ decades }: DecadeChipsProps) {
  const active = useActiveDecade(decades);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [active]);

  return (
    <nav className="nav-chips" aria-label="Jump to decade">
      <ul className="nav-chips__list">
        {decades.map((d) => {
          const isActive = d === active;
          return (
            <li key={d}>
              <button
                type="button"
                ref={isActive ? activeRef : undefined}
                className={`nav-chips__chip${isActive ? ' nav-chips__chip--active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => scrollToDecade(d)}
              >
                {d}s
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
