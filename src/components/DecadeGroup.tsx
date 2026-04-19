import type { ReactNode } from 'react';

interface DecadeGroupProps {
  decade: number;
  children: ReactNode;
}

export function DecadeGroup({ decade, children }: DecadeGroupProps) {
  return (
    <section className="decade" aria-labelledby={`decade-${decade}`}>
      <header className="decade__header">
        <h2 id={`decade-${decade}`} className="decade__label">
          {decade}s
        </h2>
        <span className="decade__rule" aria-hidden="true" />
      </header>
      <div className="decade__rows">{children}</div>
    </section>
  );
}
