import type { FranchiseOption, SortDirection } from '../../shared/viewModel';
import { SortToggle } from './SortToggle';
import { TeamFilter } from './TeamFilter';

interface ToolbarProps {
  sort: SortDirection;
  onSortChange: (sort: SortDirection) => void;
  franchises: FranchiseOption[];
  selectedFranchiseIds: ReadonlySet<string>;
  onSelectedFranchiseIdsChange: (next: Set<string>) => void;
}

export function Toolbar({
  sort,
  onSortChange,
  franchises,
  selectedFranchiseIds,
  onSelectedFranchiseIdsChange,
}: ToolbarProps) {
  return (
    <div className="toolbar" role="toolbar" aria-label="Sort and filter champions">
      <SortToggle sort={sort} onChange={onSortChange} />
      <TeamFilter
        franchises={franchises}
        selected={selectedFranchiseIds}
        onChange={onSelectedFranchiseIdsChange}
      />
    </div>
  );
}
