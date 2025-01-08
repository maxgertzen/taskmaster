import { fireEvent } from '@testing-library/dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  mockThemeStore,
  mockThemeStoreMode,
} from '@/tests/__mocks__/storeMocks';
import { forceClick, render, screen } from '@/tests/utils';

import { SpriteIcon } from '../SpriteIcon';

vi.mock('@/shared/store/themeStore', () => ({
  useThemeStore: mockThemeStore,
}));

describe('SpriteIcon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each([['light'], ['dark']])('in %s mode', (theme) => {
    beforeEach(() => {
      mockThemeStoreMode.mockReturnValue(theme);
    });

    it('renders basic icon correctly', () => {
      const { container } = render(<SpriteIcon name='plus' alt='add item' />);
      expect(container).toMatchSnapshot();
    });

    it('renders with custom size', () => {
      const { container } = render(<SpriteIcon name='plus' size={5} />);
      expect(container).toMatchSnapshot();
    });

    it('handles click events', () => {
      const mockOnClick = vi.fn();
      render(<SpriteIcon name='plus' onClick={mockOnClick} />);

      const icon = screen.getByTestId('icon-plus');
      fireEvent.click(icon);

      expect(mockOnClick).toHaveBeenCalled();
    });

    it('prevents default and stops propagation on click', async () => {
      const mockOnClick = vi.fn();

      render(<SpriteIcon name='plus' onClick={mockOnClick} />);

      const icon = screen.getByTestId('icon-plus');
      const { preventDefaultMock, stopPropagationMock } = forceClick(icon);

      expect(preventDefaultMock).toHaveBeenCalled();
      expect(stopPropagationMock).toHaveBeenCalled();
    });

    it('handles visibility prop', () => {
      const { container } = render(
        <SpriteIcon name='plus' isVisible={false} />
      );
      expect(container).toMatchSnapshot();
    });

    it('uses dark variant of icon when available in dark mode', () => {
      const { container } = render(<SpriteIcon name='plus' />);
      expect(container).toMatchSnapshot();
    });
  });
});
