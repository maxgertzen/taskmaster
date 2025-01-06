import { act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { render, screen } from '@/tests/utils';

import { HomeButton } from '../HomeButton';

describe('HomeButton', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each([
    ['expanded', false],
    ['collapsed', true],
  ])('when %s (isCollapsed: %s)', (_, isCollapsed) => {
    it.each([
      ['light', undefined],
      ['dark', 'dark'],
    ])('renders correctly in %s theme', (_, theme) => {
      const { container } = render(
        <HomeButton isCollapsed={isCollapsed} onClick={mockOnClick} />,
        { theme: theme as 'light' | 'dark' }
      );
      expect(container).toMatchSnapshot();
    });

    it('handles text visibility correctly', () => {
      render(<HomeButton isCollapsed={isCollapsed} onClick={mockOnClick} />);

      if (isCollapsed) {
        expect(screen.queryByText('Home')).not.toBeInTheDocument();
      } else {
        expect(screen.getByText('Home')).toBeInTheDocument();
      }
    });
  });

  describe('User Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      render(<HomeButton isCollapsed={false} onClick={mockOnClick} />);

      await act(async () => {
        fireEvent.click(screen.getByTestId('home-button'));
      });

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icon Rendering', () => {
    it('always renders home icon regardless of collapsed state', () => {
      const { rerender } = render(
        <HomeButton isCollapsed={false} onClick={mockOnClick} />
      );

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();

      rerender(<HomeButton isCollapsed={true} onClick={mockOnClick} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });
  });
});
