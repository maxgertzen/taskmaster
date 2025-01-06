import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  mockThemeStore,
  mockThemeStoreMode,
} from '@/tests/__mocks__/storeMocks';
import { render, screen } from '@/tests/utils';

import { Logo } from '../Logo';

vi.mock('@/shared/store/themeStore', () => ({
  useThemeStore: mockThemeStore,
}));

vi.mock('@/shared/assets/images/taskmaster.png', () => ({
  default: 'taskmaster.png',
}));

vi.mock('@/shared/assets/images/taskmaster-grayscale.png', () => ({
  default: 'taskmaster-grayscale.png',
}));

describe('Logo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each([
    ['light', 'taskmaster.png'],
    ['dark', 'taskmaster-grayscale.png'],
  ])('in %s theme', (theme, expectedSrc) => {
    beforeEach(() => {
      mockThemeStoreMode.mockReturnValue(theme);
    });

    it.each([
      ['small', false],
      ['medium', false],
      ['large', false],
      ['small', true],
      ['medium', true],
      ['large', true],
    ])('renders correctly with size=%s and withTitle=%s', (size, withTitle) => {
      const { container } = render(
        <Logo
          size={size as 'small' | 'medium' | 'large'}
          withTitle={withTitle}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('uses correct logo image for theme', () => {
      render(<Logo />);
      const logo = screen.getByTestId('logo');
      expect(logo).toHaveAttribute('src', expectedSrc);
    });
  });

  describe('Title Rendering', () => {
    beforeEach(() => {
      mockThemeStoreMode.mockReturnValue('light');
    });

    it('shows title when withTitle is true', () => {
      render(<Logo withTitle={true} />);
      expect(screen.getByText('TaskMaster')).toBeInTheDocument();
    });

    it('hides title when withTitle is false', () => {
      render(<Logo withTitle={false} />);
      expect(screen.queryByText('TaskMaster')).not.toBeInTheDocument();
    });
  });
});
