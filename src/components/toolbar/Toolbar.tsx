import type { SortDirection } from '../../utils/viewModel';
import { SortToggle } from './SortToggle';
import { TeamFilter } from './TeamFilter';

interface ToolbarProps {
  sort: SortDirection;
  onSortChange: (sort: SortDirection) => void;
  allTeams: string[];
  selectedTeams: ReadonlySet<string>;
  onSelectedTeamsChange: (next: Set<string>) => void;
}

export function Toolbar({
  sort,
  onSortChange,
  allTeams,
  selectedTeams,
  onSelectedTeamsChange,
}: ToolbarProps) {
  return (
    <div className="toolbar" role="toolbar" aria-label="Sort and filter champions">
      <SortToggle sort={sort} onChange={onSortChange} />
      <TeamFilter
        allTeams={allTeams}
        selectedTeams={selectedTeams}
        onChange={onSelectedTeamsChange}
      />
    </div>
  );
}
