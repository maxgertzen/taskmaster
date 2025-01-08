import { fireEvent } from '@testing-library/dom';
import { act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { render, screen } from '@/tests/utils';

import { Input } from '../Input';

describe('Input', () => {
  const mockOnSubmit = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe.each([
    ['regular', false],
    ['search', true],
  ])('%s input type', (_, isSearch) => {
    it.each([
      ['light', undefined],
      ['dark', 'dark'],
    ])('renders correctly in %s theme', (_, theme) => {
      const { container } = render(
        <Input
          placeholder='Enter text'
          onSubmit={mockOnSubmit}
          isSearch={isSearch}
        />,
        { theme: theme as 'light' | 'dark' }
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Rendering States', () => {
    it('renders with toggle hidden initially when withToggle=true', () => {
      render(
        <Input
          placeholder='Toggle input'
          onSubmit={mockOnSubmit}
          withToggle={true}
        />
      );

      expect(screen.queryByTestId('input')).not.toBeInTheDocument();
      expect(screen.getByTestId('add-icon')).toBeInTheDocument();
    });

    it('shows input with initial value despite withToggle=true', () => {
      render(
        <Input
          placeholder='Toggle input'
          onSubmit={mockOnSubmit}
          withToggle={true}
          value='initial value'
        />
      );

      expect(screen.getByTestId('input')).toBeInTheDocument();
      expect(screen.getByTestId('add-icon')).toBeInTheDocument();
    });

    it('renders correct icon for search variant', () => {
      render(
        <Input placeholder='Search' onSubmit={mockOnSubmit} isSearch={true} />
      );

      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('handles text input changes', async () => {
      render(<Input placeholder='Enter text' onSubmit={mockOnSubmit} />);

      const input = screen.getByTestId('input');
      await act(async () => {
        fireEvent.change(input, { target: { value: 'test input' } });
      });

      expect(input).toHaveValue('test input');
    });

    it('submits on Enter key press', async () => {
      render(<Input placeholder='Enter text' onSubmit={mockOnSubmit} />);

      const input = screen.getByTestId('input');
      await act(async () => {
        fireEvent.change(input, { target: { value: 'test input' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      expect(mockOnSubmit).toHaveBeenCalledWith('test input');
    });

    it('toggles input visibility with icon when withToggle=true', async () => {
      render(
        <Input
          placeholder='Toggle input'
          onSubmit={mockOnSubmit}
          withToggle={true}
        />
      );

      const icon = screen.getByTestId('add-icon');

      await act(async () => {
        fireEvent.click(icon);
      });
      expect(screen.getByTestId('input')).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(icon);
      });
      expect(screen.queryByTestId('input')).not.toBeInTheDocument();
    });

    it('calls onReset when provided', async () => {
      render(
        <Input
          placeholder='Test input'
          onSubmit={mockOnSubmit}
          onReset={mockOnReset}
        />
      );

      const input = screen.getByTestId('input');
      await act(async () => {
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      expect(mockOnReset).toHaveBeenCalled();
    });
  });

  describe('Search Behavior', () => {
    it('debounces search input', async () => {
      render(
        <Input placeholder='Search' onSubmit={mockOnSubmit} isSearch={true} />
      );

      const input = screen.getByTestId('input');

      await act(async () => {
        fireEvent.change(input, { target: { value: 'search term' } });
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(mockOnSubmit).toHaveBeenCalledWith('search term');
    });
  });

  describe('Props Updates', () => {
    it('updates input value when value prop changes', async () => {
      const { rerender } = render(
        <Input
          placeholder='Test input'
          onSubmit={mockOnSubmit}
          value='initial'
          isSearch={true}
        />
      );

      expect(screen.getByTestId('input')).toHaveValue('initial');

      rerender(
        <Input
          placeholder='Test input'
          onSubmit={mockOnSubmit}
          value='updated'
          isSearch={true}
        />
      );

      expect(screen.getByTestId('input')).toHaveValue('updated');
    });
  });
});
