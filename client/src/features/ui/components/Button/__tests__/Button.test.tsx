import { describe, it, expect, vi } from 'vitest';

import { render, screen, within } from '@/tests/utils';

import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly in light theme', () => {
    const { container } = render(<Button>Click me</Button>, { theme: 'light' });
    expect(container).toMatchSnapshot();
  });

  it('renders correctly in dark theme', () => {
    const { container } = render(<Button>Click me</Button>, { theme: 'dark' });
    expect(container).toMatchSnapshot();
  });

  it('renders the children', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByTestId('button');
    expect(button).toBeDefined();

    const text = within(button).getByText(/click me/i);
    expect(text.textContent).toBe('Click me');
  });

  it('calls the onClick function when clicked', async () => {
    const handleClick = vi.fn();
    const { user } = render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByTestId('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', async () => {
    const handleClick = vi.fn();
    const { user } = render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );

    const button = screen.getByTestId('button');
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
