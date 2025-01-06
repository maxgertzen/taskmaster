import { fireEvent } from '@testing-library/dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { render, screen } from '@/tests/utils';

import { PopupMenu } from '../PopupMenu';

describe('PopupMenu', () => {
  const mockOnClose = vi.fn();
  const mockOptionClick = vi.fn();

  const defaultOptions = [
    { label: 'Option 1', onClick: mockOptionClick },
    { label: 'Option 2', onClick: mockOptionClick },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each([['left'], ['right'], ['full']])(
    'with %s orientation',
    (orientation) => {
      it.each([
        ['light', undefined],
        ['dark', 'dark'],
      ])('renders correctly in %s theme when open', (_, theme) => {
        const { container } = render(
          <PopupMenu
            options={defaultOptions}
            onClose={mockOnClose}
            isOpen={true}
            orientation={orientation as 'left' | 'right' | 'full'}
          />,
          { theme: theme as 'light' | 'dark' }
        );
        expect(container).toMatchSnapshot();
      });
    }
  );

  describe('Visibility', () => {
    it('renders nothing when closed', () => {
      render(
        <PopupMenu
          options={defaultOptions}
          onClose={mockOnClose}
          isOpen={false}
        />
      );
      expect(screen.queryByTestId('popup-menu')).not.toBeInTheDocument();
    });

    it('renders menu when open', () => {
      render(
        <PopupMenu
          options={defaultOptions}
          onClose={mockOnClose}
          isOpen={true}
        />
      );
      expect(screen.queryByTestId('popup-menu')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls option onClick and closes when option is clicked', async () => {
      const { user } = render(
        <PopupMenu
          options={defaultOptions}
          onClose={mockOnClose}
          isOpen={true}
        />
      );

      await user.click(screen.getByText('Option 1'));
      expect(mockOptionClick).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('handles disabled options', async () => {
      const options = [
        { label: 'Disabled Option', onClick: mockOptionClick, disabled: true },
      ];

      const { user } = render(
        <PopupMenu options={options} onClose={mockOnClose} isOpen={true} />
      );

      await user.click(screen.getByText('Disabled Option'));
      expect(mockOptionClick).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('closes when clicking outside', () => {
      render(
        <PopupMenu
          options={defaultOptions}
          onClose={mockOnClose}
          isOpen={true}
        />
      );

      fireEvent.mouseUp(document);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not close when clicking inside menu', () => {
      render(
        <PopupMenu
          options={defaultOptions}
          onClose={mockOnClose}
          isOpen={true}
        />
      );

      const menu = screen.queryByTestId('popup-menu');
      if (!menu) return;

      fireEvent.click(menu);
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
