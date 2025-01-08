import { describe, it, expect, vi } from 'vitest';

import { render, screen } from '@/tests/utils';

import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  it('renders correctly in light theme', () => {
    const { container } = render(
      <Checkbox checked={true} onChange={vi.fn()} label='Label' />,
      { theme: 'light' }
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly in dark theme', () => {
    const { container } = render(
      <Checkbox checked={true} onChange={vi.fn()} label='Label' />,
      { theme: 'dark' }
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the label', () => {
    const { container } = render(
      <Checkbox checked={true} onChange={vi.fn()} label='Label' />
    );
    expect(container).toMatchSnapshot();
  });

  it('calls the onChange function when clicked', async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <Checkbox checked={true} onChange={handleChange} label='Label' />
    );

    const checkbox = await screen.findByTestId('checkbox');
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('is checked when checked prop is true', () => {
    render(<Checkbox checked={true} onChange={vi.fn()} label='Label' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('is not checked when checked prop is false', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label='Label' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).not.toBeChecked();
  });
});
