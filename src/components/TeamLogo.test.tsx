import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TeamLogo } from './TeamLogo';

describe('TeamLogo', () => {
  it('renders the first source as an img src', () => {
    render(
      <TeamLogo
        sources={['https://example.test/a.png', 'https://example.test/b.png']}
        color="#000000"
        name="Test Team"
        abbr="TST"
      />,
    );
    const img = screen.getByAltText('Test Team logo') as HTMLImageElement;
    expect(img.src).toBe('https://example.test/a.png');
  });

  it('falls back to the next source on error', () => {
    render(
      <TeamLogo
        sources={['https://example.test/a.png', 'https://example.test/b.png']}
        color="#000000"
        name="Test Team"
        abbr="TST"
      />,
    );
    const img = screen.getByAltText('Test Team logo') as HTMLImageElement;
    fireEvent.error(img);
    expect(img.src).toBe('https://example.test/b.png');
  });

  it('falls back to a color-filled text badge when all sources error', () => {
    render(
      <TeamLogo
        sources={['https://example.test/a.png']}
        color="#ff0000"
        name="Test Team"
        abbr="TST"
      />,
    );
    const img = screen.getByAltText('Test Team logo') as HTMLImageElement;
    fireEvent.error(img);
    expect(screen.getByLabelText('Test Team logo').tagName).toBe('SPAN');
    expect(screen.getByText('TST')).toBeInTheDocument();
  });

  it('renders the text badge immediately when sources is empty', () => {
    render(<TeamLogo sources={[]} color="#ff0000" name="Test Team" abbr="TST" />);
    expect(screen.getByLabelText('Test Team logo').tagName).toBe('SPAN');
    expect(screen.getByText('TST')).toBeInTheDocument();
  });
});
