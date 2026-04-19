import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Toolbar } from './Toolbar';

const ALL = ['Boston Bruins', 'Montreal Canadiens', 'Toronto Maple Leafs'];

function setup(initial?: { sort?: 'desc' | 'asc'; selected?: Set<string> }) {
  const onSortChange = vi.fn();
  const onSelectedTeamsChange = vi.fn();
  const utils = render(
    <Toolbar
      sort={initial?.sort ?? 'desc'}
      onSortChange={onSortChange}
      allTeams={ALL}
      selectedTeams={initial?.selected ?? new Set()}
      onSelectedTeamsChange={onSelectedTeamsChange}
    />,
  );
  return { ...utils, onSortChange, onSelectedTeamsChange };
}

describe('Toolbar', () => {
  describe('SortToggle', () => {
    it('reads "Newest first" by default and flips to asc on click', async () => {
      const user = userEvent.setup();
      const { onSortChange } = setup();
      const btn = screen.getByRole('button', { name: /Sort order: Newest first/i });
      expect(btn).toHaveTextContent(/Newest first/);
      await user.click(btn);
      expect(onSortChange).toHaveBeenCalledWith('asc');
    });

    it('reads "Oldest first" when sort is asc, and flips to desc on click', async () => {
      const user = userEvent.setup();
      const { onSortChange } = setup({ sort: 'asc' });
      const btn = screen.getByRole('button', { name: /Sort order: Oldest first/i });
      await user.click(btn);
      expect(onSortChange).toHaveBeenCalledWith('desc');
    });
  });

  describe('TeamFilter', () => {
    it('reads "All teams" when nothing is selected', () => {
      setup();
      expect(screen.getByText('All teams')).toBeInTheDocument();
    });

    it('reads "N selected" with the current count', () => {
      setup({ selected: new Set(['Boston Bruins', 'Montreal Canadiens']) });
      expect(screen.getByText('2 selected')).toBeInTheDocument();
    });

    it('toggles a team on and off when its checkbox is clicked', async () => {
      const user = userEvent.setup();
      const { onSelectedTeamsChange } = setup();
      // Open the disclosure by clicking the summary.
      await user.click(screen.getByText('All teams'));
      await user.click(screen.getByRole('checkbox', { name: 'Boston Bruins' }));
      expect(onSelectedTeamsChange).toHaveBeenCalledWith(new Set(['Boston Bruins']));
    });

    it('clears all selections via the Clear button', async () => {
      const user = userEvent.setup();
      const { onSelectedTeamsChange } = setup({ selected: new Set(ALL) });
      await user.click(screen.getByText('3 selected'));
      await user.click(screen.getByRole('button', { name: 'Clear' }));
      expect(onSelectedTeamsChange).toHaveBeenCalledWith(new Set());
    });
  });

  describe('accessibility', () => {
    it('has no axe violations in the default closed state', async () => {
      const { container } = setup();
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations with the filter panel open', async () => {
      const user = userEvent.setup();
      const { container } = setup();
      await user.click(screen.getByText('All teams'));
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
