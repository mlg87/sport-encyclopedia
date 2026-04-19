import type { ReactNode } from 'react';

interface DecadeGroupProps {
  decade: number;
  children: ReactNode;
  /** When true, the group renders a muted "no matches" placeholder
      instead of children — used when a team filter excludes every
      champion in this decade. */
  empty?: boolean;
  emptyMessage?: string;
}

export function DecadeGroup({ decade, children, empty = false, emptyMessage }: DecadeGroupProps) {
  return (
    <section
      className={`decade${empty ? ' decade--empty' : ''}`}
      aria-labelledby={`decade-${decade}`}
    >
      <header className="decade__header">
        <h2 id={`decade-${decade}`} className="decade__label">
          {decade}s
        </h2>
        <span className="decade__rule" aria-hidden="true" />
      </header>
      {empty ? (
        <p className="decade__empty">{emptyMessage ?? 'No matches this decade.'}</p>
      ) : (
        <div className="decade__rows">{children}</div>
      )}
    </section>
  );
}
