import { fireEvent } from '@testing-library/dom';
import { act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { render, screen } from '@/tests/utils';

import { EditableInput } from '../EditableInput';

describe('EditableInput', () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
    mockCancel.mockClear();
  });

  it('renders correctly in light theme', () => {
    const { container } = render(
      <EditableInput
        placeholder='Type something'
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />,
      { theme: 'light' }
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly in dark theme', () => {
    const { container } = render(
      <EditableInput
        placeholder='Type something'
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />,
      { theme: 'dark' }
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with initial text when provided', () => {
    render(
      <EditableInput
        initialText='Initial value'
        placeholder='Type something'
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    const input = screen.getByDisplayValue('Initial value');
    expect(input).toBeInTheDocument();
  });

  it('updates text on change', () => {
    render(
      <EditableInput
        placeholder='Type something'
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    const input = screen.getByPlaceholderText('Type something');
    act(() => {
      fireEvent.change(input, { target: { value: 'New text' } });
    });

    expect(input).toHaveValue('New text');
  });

  it('calls onSubmit with trimmed text when Enter is pressed', () => {
    render(
      <EditableInput
        placeholder='Type something'
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    const input = screen.getByPlaceholderText('Type something');

    act(() => {
      fireEvent.change(input, { target: { value: '  Submit this  ' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(mockSubmit).toHaveBeenCalledWith('Submit this');
    expect(input).toHaveValue('');
  });

  it('calls onCancel when Escape is pressed', () => {
    render(
      <EditableInput
        placeholder='Type something'
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    const input = screen.getByPlaceholderText('Type something');
    act(() => {
      fireEvent.change(input, { target: { value: 'Cancel this' } });
      fireEvent.keyDown(input, { key: 'Escape' });
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with trimmed text on blur when text exists', () => {
    render(
      <EditableInput
        placeholder='Type something'
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    const input = screen.getByPlaceholderText('Type something');

    act(() => {
      fireEvent.change(input, { target: { value: '  Blur text  ' } });
      input.blur();
    });

    expect(mockSubmit).toHaveBeenCalledWith('Blur text');
    expect(input).toHaveValue('');
  });

  it('calls onCancel on blur when text is empty or only whitespace', () => {
    render(
      <EditableInput
        placeholder='Type something'
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    const input = screen.getByPlaceholderText('Type something');
    act(() => {
      fireEvent.change(input, { target: { value: '   ' } });
      input.blur();
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('has autofocus by default', () => {
    render(
      <EditableInput
        placeholder='Type something'
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    const input = screen.getByPlaceholderText('Type something');
    expect(input).toHaveFocus();
  });
});
