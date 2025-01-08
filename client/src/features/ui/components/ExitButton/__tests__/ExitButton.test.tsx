import { describe, it, expect, vi } from 'vitest';

import { render, screen, within } from '@/tests/utils';

import { ExitButton } from '../ExitButton';

describe('ExitButton', () => {
  describe.each([
    ['expanded', false],
    ['collapsed', true],
  ])('when %s (isCollapsed: %s)', (_, isCollapsed) => {
    it.each([
      ['light', undefined],
      ['dark', 'dark'],
    ])('renders correctly in %s theme', (_, theme) => {
      const { container } = render(<ExitButton isCollapsed={isCollapsed} />, {
        theme: theme as 'light' | 'dark',
      });
      expect(container).toMatchSnapshot();
    });

    it('renders icon correctly', () => {
      render(<ExitButton isCollapsed={isCollapsed} />);
      const button = screen.getByTestId('exit-button');
      expect(within(button).getByTestId('exit-icon')).toBeInTheDocument();
    });

    it('handles text visibility correctly', () => {
      render(<ExitButton isCollapsed={isCollapsed} />);
      const button = screen.getByTestId('exit-button');

      if (isCollapsed) {
        expect(within(button).queryByText('Exit')).not.toBeInTheDocument();
      } else {
        expect(within(button).getByText('Exit')).toBeInTheDocument();
      }
    });

    it('calls onClick when clicked', async () => {
      const handleClick = vi.fn();
      const { user } = render(
        <ExitButton isCollapsed={isCollapsed} onClick={handleClick} />
      );

      await user.click(screen.getByTestId('exit-button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
