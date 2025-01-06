import { describe, it, expect, vi, beforeEach } from 'vitest';

import { mockSpotlightStore } from '@/tests/__mocks__/storeMocks';
import { render, screen } from '@/tests/utils';

import { HighlightedArea } from '../HighlightedArea';

const mockUseSpotlightStore = vi.fn();
vi.mock('@/shared/store/spotlightStore', () => ({
  useSpotlightStore: mockSpotlightStore,
}));

describe('HighlightedArea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each([
    ['inactive', null],
    ['active', 'test-area'],
  ])('when %s', (_, spotlightTarget) => {
    it.each([
      ['light', undefined],
      ['dark', 'dark'],
    ])('renders correctly in %s theme', (_, theme) => {
      mockUseSpotlightStore.mockImplementation(() => spotlightTarget);

      const { container } = render(
        <HighlightedArea id='test-area'>
          <div>Test Content</div>
        </HighlightedArea>,
        { theme: theme as 'light' | 'dark' }
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Content Rendering', () => {
    it('renders children correctly', () => {
      mockUseSpotlightStore.mockImplementation(() => null);

      render(
        <HighlightedArea id='test-area'>
          <div data-testid='child'>Test Content</div>
        </HighlightedArea>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Spotlight Behavior', () => {
    it('sets data-spotlight attribute correctly', () => {
      mockUseSpotlightStore.mockImplementation(() => null);

      const { container } = render(
        <HighlightedArea id='test-area'>
          <div>Test Content</div>
        </HighlightedArea>
      );

      expect(container.firstChild).toHaveAttribute(
        'data-spotlight',
        'test-area'
      );
    });

    it('reflects active state when spotlight matches', () => {
      mockUseSpotlightStore.mockImplementation(() => 'test-area');

      const { container } = render(
        <HighlightedArea id='test-area'>
          <div>Test Content</div>
        </HighlightedArea>
      );

      expect(container.firstChild).toHaveAttribute(
        'data-spotlight',
        'test-area'
      );
    });

    it('reflects inactive state when spotlight differs', () => {
      mockUseSpotlightStore.mockImplementation(() => 'other-area');

      const { container } = render(
        <HighlightedArea id='test-area'>
          <div>Test Content</div>
        </HighlightedArea>
      );

      expect(container.firstChild).toHaveAttribute(
        'data-spotlight',
        'test-area'
      );
    });
  });
});
