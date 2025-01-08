import { fireEvent } from '@testing-library/dom';
import { act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';

import {
  mockDashboardStore,
  mockViewportStore,
  mockIsMobile,
  mockSetSearchTerm,
} from '@/tests/__mocks__/storeMocks';
import { render, screen } from '@/tests/utils';

import { Searchbar } from '../Searchbar';

vi.mock('@/shared/store/dashboardStore', () => ({
  useDashboardStore: mockDashboardStore,
}));

vi.mock('@/shared/store/viewportStore', () => ({
  useViewportStore: mockViewportStore,
}));

describe('Searchbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each([
    ['desktop', false],
    ['mobile', true],
  ])('on %s view', (_, isMobile) => {
    beforeEach(() => {
      mockIsMobile.mockReturnValue(isMobile);
    });

    it.each([
      ['light', undefined],
      ['dark', 'dark'],
    ])('renders correctly in %s theme', (_, theme) => {
      const { container } = render(
        <Searchbar placeholder='Search' onSearchCallback={mockSetSearchTerm} />,
        { theme: theme as 'light' | 'dark' }
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Search Behavior', () => {
    beforeEach(() => {
      mockIsMobile.mockReturnValue(false);
      vi.useFakeTimers();
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    it('calls onSearchCallback and setSearchTerm when search is triggered', async () => {
      const mockOnSearchCallback = vi.fn();
      render(
        <Searchbar
          placeholder='Search'
          onSearchCallback={mockOnSearchCallback}
        />
      );

      const input = screen.getByTestId('input');

      await act(async () => {
        fireEvent.change(input, { target: { value: 'test search' } });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(mockOnSearchCallback).toHaveBeenCalled();
      expect(mockSetSearchTerm).toHaveBeenCalledWith('test search');
    });

    it('handles onReset when search is submitted with selectedListId', async () => {
      const mockOnSearchCallback = vi.fn();
      render(
        <Searchbar
          placeholder='Search'
          selectedListId='123'
          onSearchCallback={mockOnSearchCallback}
        />
      );

      const input = screen.getByTestId('input');

      await act(async () => {
        fireEvent.change(input, { target: { value: 'test search' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      expect(mockSetSearchTerm).toHaveBeenCalledWith('');
    });

    it('does not reset search term when submitting without selectedListId', async () => {
      const mockOnSearchCallback = vi.fn();
      render(
        <Searchbar
          placeholder='Search'
          onSearchCallback={mockOnSearchCallback}
        />
      );

      const input = screen.getByTestId('input');

      await act(async () => {
        fireEvent.change(input, { target: { value: 'test search' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      expect(mockSetSearchTerm).not.toHaveBeenCalledWith('');
    });
  });
});
