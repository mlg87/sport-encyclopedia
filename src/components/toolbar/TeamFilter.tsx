import { useEffect, useRef, useState } from 'react';
import type { FranchiseOption } from '../../utils/viewModel';

interface TeamFilterProps {
  franchises: FranchiseOption[];
  selected: ReadonlySet<string>;
  onChange: (next: Set<string>) => void;
}

// Team multi-select backed by a <details> element. Native disclosure semantics
// give us keyboard + screen-reader support for free; we layer click-outside and
// Escape-to-close on top so it behaves like the dropdown readers expect.
// Selection is keyed by franchise_id so name changes across eras collapse
// into a single entry — the label shown is the franchise's most recent name.
export function TeamFilter({ franchises, selected, onChange }: TeamFilterProps) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!detailsRef.current) return;
      if (detailsRef.current.contains(e.target as Node)) return;
      detailsRef.current.open = false;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && detailsRef.current) {
        detailsRef.current.open = false;
        setOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggleFranchise = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  };

  const clear = () => onChange(new Set());

  const count = selected.size;
  const summaryLabel = count === 0 ? 'All teams' : `${count} selected`;

  return (
    <details
      ref={detailsRef}
      className="toolbar__filter"
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="toolbar__filter-summary">
        <span className="toolbar__filter-label" aria-hidden="true">
          Teams
        </span>
        <span className="toolbar__filter-value">{summaryLabel}</span>
        <svg
          className="toolbar__filter-caret"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
        >
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.3" fill="none" />
        </svg>
      </summary>
      <div className="toolbar__filter-panel" role="group" aria-label="Filter by team">
        <div className="toolbar__filter-header">
          <span>{count === 0 ? 'Select teams' : `${count} of ${franchises.length}`}</span>
          <button
            type="button"
            className="toolbar__filter-clear"
            onClick={clear}
            disabled={count === 0}
          >
            Clear
          </button>
        </div>
        <ul className="toolbar__filter-list">
          {franchises.map((franchise) => {
            const checked = selected.has(franchise.id);
            return (
              <li key={franchise.id}>
                <label className="toolbar__filter-option">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleFranchise(franchise.id)}
                  />
                  <span>{franchise.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
