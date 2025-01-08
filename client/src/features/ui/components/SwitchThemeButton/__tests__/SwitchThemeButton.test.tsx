import { fireEvent } from '@testing-library/dom';
import { act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  mockToggleTheme,
  mockThemeStoreMode,
  mockThemeStore,
} from '@/tests/__mocks__/storeMocks';
import { render, screen } from '@/tests/utils';

import { SwitchThemeButton } from '../SwitchThemeButton';

vi.mock('@/shared/store/themeStore', () => ({
  useThemeStore: mockThemeStore,
}));

describe('SwitchThemeButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each([
    ['light', 'moon', 'Dark'],
    ['dark', 'sun', 'Light'],
  ])('in %s mode', (theme, expectedIcon, expectedLabel) => {
    beforeEach(() => {
      mockThemeStoreMode.mockReturnValue(theme);
    });

    it('renders correctly without text', () => {
      const { container } = render(<SwitchThemeButton />);
      expect(container).toMatchSnapshot();
      expect(screen.getByTestId(`icon-${expectedIcon}`)).toBeInTheDocument();
    });

    it('renders correctly with text', () => {
      const { container } = render(<SwitchThemeButton withText />);
      expect(container).toMatchSnapshot();
      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    });

    it('calls toggleTheme when clicked (without text)', async () => {
      render(<SwitchThemeButton />);

      await act(async () => {
        fireEvent.click(screen.getByTestId(`icon-${expectedIcon}`));
      });
      expect(mockToggleTheme).toHaveBeenCalled();
    });

    it('calls toggleTheme when clicked (with text)', async () => {
      render(<SwitchThemeButton withText />);

      await act(async () => {
        fireEvent.click(screen.getByTestId('switch-theme-button'));
      });
      expect(mockToggleTheme).toHaveBeenCalled();
    });
  });
});
