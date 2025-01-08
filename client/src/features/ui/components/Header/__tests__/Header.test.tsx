import { fireEvent } from '@testing-library/dom';
import { act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  mockDashboardStore,
  mockViewportStore,
  mockPopupMenuState,
  mockIsMobile,
  mockSetSelectedList,
  mockSetSearchTerm,
} from '@/tests/__mocks__/storeMocks';
import { render, screen } from '@/tests/utils';

import { Header } from '../Header';

vi.mock('@/shared/store/dashboardStore', () => ({
  useDashboardStore: mockDashboardStore,
}));

vi.mock('@/shared/store/viewportStore', () => ({
  useViewportStore: mockViewportStore,
}));

vi.mock('@/shared/hooks', () => ({
  usePopupMenuState: mockPopupMenuState,
}));

describe('Header', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  const mockSetView = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  // Desktop View Tests
  describe('Desktop View', () => {
    beforeEach(() => {
      mockIsMobile.mockReturnValue(false);
    });

    it('renders correctly in light theme', () => {
      const { container } = render(
        <Header
          user={mockUser}
          view='board'
          setView={mockSetView}
          onBack={mockOnBack}
        />,
        { theme: 'light' }
      );
      expect(container).toMatchSnapshot();
    });

    it('renders correctly in dark theme', () => {
      const { container } = render(
        <Header
          user={mockUser}
          view='board'
          setView={mockSetView}
          onBack={mockOnBack}
        />,
        { theme: 'dark' }
      );
      expect(container).toMatchSnapshot();
    });

    it('displays logo with title', () => {
      render(<Header user={mockUser} />);
      expect(screen.getByTestId('logo')).toBeInTheDocument();
    });
  });

  // Mobile View Tests
  describe('Mobile View', () => {
    beforeEach(() => {
      mockIsMobile.mockReturnValue(true);
    });

    it('renders correctly in light theme', () => {
      const { container } = render(
        <Header
          user={mockUser}
          view='board'
          setView={mockSetView}
          onBack={mockOnBack}
        />,
        { theme: 'light' }
      );
      expect(container).toMatchSnapshot();
    });

    it('renders correctly in dark theme', () => {
      const { container } = render(
        <Header
          user={mockUser}
          view='board'
          setView={mockSetView}
          onBack={mockOnBack}
        />,
        { theme: 'dark' }
      );
      expect(container).toMatchSnapshot();
    });

    it('does not display logo', () => {
      render(<Header user={mockUser} />);
      expect(screen.queryByTestId('logo')).toBeNull();
    });
  });

  // User Details Tests
  describe('User Details', () => {
    it('displays user name when provided', () => {
      render(<Header user={mockUser} />);
      expect(screen.getByTestId('user-name')).toBeInTheDocument();
    });

    it('displays generic greeting when no user name is provided', () => {
      render(<Header user={{ ...mockUser, name: '' }} />);
      expect(screen.getByTestId('user-name')).toBeInTheDocument();
    });

    it('handles null user', () => {
      render(<Header user={null} />);
      expect(screen.queryByTestId('user-name')).not.toBeNull();
    });
  });

  // View Tests
  describe('View Behavior', () => {
    beforeEach(() => {
      mockIsMobile.mockReturnValue(true);
    });

    it('handles board view with mobile back button', async () => {
      render(<Header user={mockUser} view='board' onBack={mockOnBack} />);

      const backButton = screen.getByTestId('back-to-lists');
      await act(async () => {
        fireEvent.click(backButton);
      });
      expect(mockOnBack).toHaveBeenCalled();
    });

    it('handles list view', () => {
      render(<Header user={mockUser} view='list' setView={mockSetView} />);
      expect(screen.queryByTestId('back-to-lists')).toBeNull();
    });
  });

  // Search Behavior Tests
  describe('Search Behavior', () => {
    it('handles search in board view with view change', async () => {
      vi.useFakeTimers();
      mockIsMobile.mockReturnValue(true);

      render(<Header user={mockUser} view='board' setView={mockSetView} />);
      const searchIcon = screen.getByTestId('search-icon');
      await act(async () => {
        fireEvent.click(searchIcon);
      });

      const input = screen.getByTestId('input');

      await act(async () => {
        fireEvent.change(input, { target: { value: 'test search' } });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(mockSetSearchTerm).toHaveBeenCalledWith('test search');
      expect(mockSetSelectedList).toHaveBeenCalledWith(null);

      vi.useRealTimers();
    });

    it('handles search without view change', async () => {
      vi.useFakeTimers();
      render(<Header user={mockUser} />);

      const searchIcon = screen.getByTestId('search-icon');

      await act(async () => {
        fireEvent.click(searchIcon);
      });

      const input = screen.getByTestId('input');

      await act(async () => {
        fireEvent.change(input, { target: { value: 'test search' } });
      });

      await act(async () => {
        vi.runAllTimers();
      });

      expect(mockSetSelectedList).toHaveBeenCalledWith(null);
      expect(mockSetView).not.toHaveBeenCalled();
    });
  });
});
