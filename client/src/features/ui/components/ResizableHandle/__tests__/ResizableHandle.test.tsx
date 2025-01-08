import { fireEvent } from '@testing-library/dom';
import { act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { render } from '@/tests/utils';

import { ResizableHandle } from '../ResizableHandle';

describe('ResizableHandle', () => {
  const mockOnResize = vi.fn();
  const mockSetWidth = vi.fn();
  const initialProps = {
    onResize: mockOnResize,
    initialWidth: 200,
    setWidth: mockSetWidth,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ['light', undefined],
    ['dark', 'dark'],
  ])('renders correctly in %s theme', (_, theme) => {
    const { container } = render(<ResizableHandle {...initialProps} />, {
      theme: theme as 'light' | 'dark',
    });
    expect(container).toMatchSnapshot();
  });

  describe('Resize Behavior', () => {
    it('handles mouse drag within bounds', async () => {
      const { container } = render(<ResizableHandle {...initialProps} />);
      const handle = container.firstChild as HTMLElement;

      await act(async () => {
        // Start resize
        fireEvent.mouseDown(handle, { clientX: 200 });

        // Drag
        fireEvent.mouseMove(document, { clientX: 250 });
        expect(mockSetWidth).toHaveBeenCalledWith(250);
        expect(mockOnResize).toHaveBeenCalledWith(true);

        // End resize
        fireEvent.mouseUp(document);
        expect(mockOnResize).toHaveBeenCalledWith(false);
      });
    });

    it('respects minimum width constraint', async () => {
      const { container } = render(
        <ResizableHandle {...initialProps} minWidth={150} />
      );
      const handle = container.firstChild as HTMLElement;

      await act(async () => {
        fireEvent.mouseDown(handle, { clientX: 200 });
        fireEvent.mouseMove(document, { clientX: 100 }); // Try to drag below min
      });

      expect(mockSetWidth).toHaveBeenCalledWith(150);
    });

    it('respects maximum width constraint', async () => {
      const { container } = render(
        <ResizableHandle {...initialProps} maxWidth={500} />
      );
      const handle = container.firstChild as HTMLElement;

      await act(async () => {
        fireEvent.mouseDown(handle, { clientX: 200 });
        fireEvent.mouseMove(document, { clientX: 800 }); // Try to drag above max
      });

      expect(mockSetWidth).toHaveBeenCalledWith(500);
    });

    it('cleans up event listeners on mouse up', async () => {
      const { container } = render(<ResizableHandle {...initialProps} />);
      const handle = container.firstChild as HTMLElement;

      await act(async () => {
        fireEvent.mouseDown(handle, { clientX: 200 });
        fireEvent.mouseUp(document);

        // Additional mouse moves should not trigger width changes
        fireEvent.mouseMove(document, { clientX: 300 });
      });

      expect(mockSetWidth).not.toHaveBeenCalledWith(300);
    });
  });
});
