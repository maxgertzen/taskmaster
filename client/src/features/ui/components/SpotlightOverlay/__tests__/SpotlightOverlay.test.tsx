import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  mockSpotlightStore,
  mockUseSpotlightStore,
} from '@/tests/__mocks__/storeMocks';
import { render } from '@/tests/utils';

import { SpotlightOverlay } from '../SpotlightOverlay';

vi.mock('@/shared/store/spotlightStore', () => ({
  useSpotlightStore: mockSpotlightStore,
}));

describe('SpotlightOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without target', () => {
    mockUseSpotlightStore.mockReturnValue(null);
    render(<SpotlightOverlay />);
  });

  it('should match snapshot', () => {
    mockUseSpotlightStore.mockReturnValue(null);
    const { container } = render(<SpotlightOverlay />);
    expect(container).toMatchSnapshot();
  });
});
