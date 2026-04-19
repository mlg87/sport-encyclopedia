import { useEffect, useState } from 'react';

// Tracks which decade section is currently "in view". Returns the integer
// decade (e.g. 1970) of the top-most section whose header is at or above
// a small offset below the sticky top — i.e. the one the reader is
// conceptually inside. Used by every nav prototype to highlight the
// active tick / chip / era.
export function useActiveDecade(decades: number[]): number {
  const [active, setActive] = useState<number>(decades[0] ?? 0);

  useEffect(() => {
    if (decades.length === 0) return;

    const update = () => {
      const offset = 140; // below any sticky header we add
      let current = decades[0];
      for (const d of decades) {
        const el = document.getElementById(`decade-${d}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - offset <= 0) current = d;
      }
      setActive(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [decades]);

  return active;
}

export function scrollToDecade(decade: number) {
  const el = document.getElementById(`decade-${decade}`);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
