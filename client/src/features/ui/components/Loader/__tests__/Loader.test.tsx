import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  mockThemeStore,
  mockThemeStoreMode,
} from '@/tests/__mocks__/storeMocks';
import { render, screen } from '@/tests/utils';

import { Loader } from '../Loader';

vi.mock('@/shared/store/themeStore', () => ({
  useThemeStore: mockThemeStore,
}));

vi.mock('@/shared/assets/animations/loader-dm.gif', () => ({
  default: 'dark-mode-loader.gif',
}));

vi.mock('@/shared/assets/animations/loader-lm.gif', () => ({
  default: 'light-mode-loader.gif',
}));

describe('Loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each([
    ['light', 'light-mode-loader.gif'],
    ['dark', 'dark-mode-loader.gif'],
  ])('in %s theme', (theme, expectedSrc) => {
    beforeEach(() => {
      mockThemeStoreMode.mockReturnValue(theme);
    });

    it('renders correctly', async () => {
      const { container } = render(<Loader />);
      expect(container).toMatchSnapshot();
    });

    it('renders with custom padding', async () => {
      const { container } = render(<Loader paddingTop={20} />);
      expect(container).toMatchSnapshot();
    });

    it('loads correct gif for theme', async () => {
      render(<Loader />);
      const image = await screen.findByAltText('Loading');
      expect(image).toHaveAttribute('src', expectedSrc);
    });
  });

  describe('Loading State', () => {
    it('shows loading text while gif is loading', () => {
      render(<Loader />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows calculating text after gif loads', async () => {
      render(<Loader />);
      expect(await screen.findByText('Calculating...')).toBeInTheDocument();
    });
  });
});
