import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { DecadeChips } from './DecadeChips';

const DECADES = [1890, 1900, 1970, 2020];

// jsdom doesn't implement scrollIntoView; stub it so clicks don't throw.
// We also use it to assert that click targets the right decade element.
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe('DecadeChips', () => {
  it('renders one labeled chip per decade', () => {
    render(<DecadeChips decades={DECADES} />);
    for (const d of DECADES) {
      expect(screen.getByRole('button', { name: `${d}s` })).toBeInTheDocument();
    }
  });

  it('exposes itself as a nav landmark labeled "Jump to decade"', () => {
    render(<DecadeChips decades={DECADES} />);
    expect(screen.getByRole('navigation', { name: /Jump to decade/i })).toBeInTheDocument();
  });

  it('marks the first decade as active on initial render (nothing has scrolled)', () => {
    render(<DecadeChips decades={DECADES} />);
    // useActiveDecade's initial state is the first decade since no section
    // headers have passed the scroll offset yet.
    expect(screen.getByRole('button', { name: '1890s' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: '2020s' })).not.toHaveAttribute('aria-current');
  });

  it('scrolls to the matching decade section when a chip is clicked', async () => {
    const user = userEvent.setup();
    // Drop stub targets into the DOM so getElementById('decade-1970') returns
    // an element whose scrollIntoView we can observe.
    const target = document.createElement('section');
    target.id = 'decade-1970';
    document.body.appendChild(target);

    render(<DecadeChips decades={DECADES} />);
    await user.click(screen.getByRole('button', { name: '1970s' }));

    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    target.remove();
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<DecadeChips decades={DECADES} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
