import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';

import { forceClick, render, screen } from '@/tests/utils';

import { ClickableWord } from '../ClickableWord';

type SpotlightStore = {
  setTarget: (target: string | null) => void;
};

const mockSetTarget = vi.fn();
vi.mock('@/shared/store/spotlightStore', () => ({
  useSpotlightStore: (selector: (state: SpotlightStore) => unknown) =>
    selector({ setTarget: mockSetTarget }),
}));

describe('ClickableWord', () => {
  beforeEach(() => {
    mockSetTarget.mockClear();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('renders correctly in light theme', () => {
    const { container } = render(
      <ClickableWord target='test-target'>Click me</ClickableWord>,
      { theme: 'light' }
    );
    expect(container).toMatchSnapshot();
  });

  it('renders correctly in dark theme', () => {
    const { container } = render(
      <ClickableWord target='test-target'>Click me</ClickableWord>,
      { theme: 'dark' }
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the children content', () => {
    render(<ClickableWord target='test-target'>Test Content</ClickableWord>);
    const link = screen.getByTestId('clickable-word');
    expect(link.textContent).toBe('Test Content');
  });

  it('calls setTarget with correct target when clicked', async () => {
    render(<ClickableWord target='test-target'>Click me</ClickableWord>);

    const link = screen.getByTestId('clickable-word');
    const { preventDefaultMock } = forceClick(link);

    expect(preventDefaultMock).toHaveBeenCalled();
    expect(mockSetTarget).toHaveBeenCalledWith('test-target');
  });

  it('resets target to null after timeout', async () => {
    vi.useFakeTimers();
    render(<ClickableWord target='test-target'>Click me</ClickableWord>);
    const link = screen.getByTestId('clickable-word');

    forceClick(link);

    expect(mockSetTarget).toHaveBeenCalledWith('test-target');
    await vi.advanceTimersByTimeAsync(1500);
    expect(mockSetTarget).toHaveBeenLastCalledWith(null);
  });
});
