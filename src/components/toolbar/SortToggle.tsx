import type { SortDirection } from '../../shared/viewModel';

interface SortToggleProps {
  sort: SortDirection;
  onChange: (sort: SortDirection) => void;
}

// Single button that flips between newest-first and oldest-first. A pair of
// radio buttons would be more explicit but would also double the footprint;
// the label text makes the current state unambiguous.
export function SortToggle({ sort, onChange }: SortToggleProps) {
  const label = sort === 'desc' ? 'Newest first' : 'Oldest first';
  const nextLabel = sort === 'desc' ? 'oldest first' : 'newest first';

  return (
    <button
      type="button"
      className="toolbar__sort"
      onClick={() => onChange(sort === 'desc' ? 'asc' : 'desc')}
      aria-label={`Sort order: ${label}. Switch to ${nextLabel}.`}
    >
      <span className="toolbar__sort-label" aria-hidden="true">
        Sort
      </span>
      <span className="toolbar__sort-value">{label}</span>
      <svg
        className="toolbar__sort-icon"
        width="10"
        height="10"
        viewBox="0 0 10 10"
        aria-hidden="true"
      >
        <path
          d={
            sort === 'desc'
              ? 'M1 2h8M2.5 5h5M4 8h2' // wide → narrow (desc feel)
              : 'M4 2h2M2.5 5h5M1 8h8' // narrow → wide (asc feel)
          }
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </button>
  );
}
