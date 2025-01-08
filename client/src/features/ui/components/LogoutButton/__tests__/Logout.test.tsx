import { describe, it, expect, vi, beforeEach } from 'vitest';

import { render, screen } from '@/tests/utils';

import { LogoutButton } from '../LogoutButton';

const mockLogout = vi.fn();
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    logout: mockLogout,
  }),
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true,
    });
  });

  it.each([
    ['light', undefined],
    ['dark', 'dark'],
  ])('renders correctly in %s theme', (_, theme) => {
    const { container } = render(<LogoutButton />, {
      theme: theme as 'light' | 'dark',
    });
    expect(container).toMatchSnapshot();
  });

  describe('User Interactions', () => {
    it('calls logout with correct return URL when clicked', async () => {
      const { user } = render(<LogoutButton />);

      await user.click(screen.getByText('Logout'));

      expect(mockLogout).toHaveBeenCalledWith({
        logoutParams: {
          returnTo: 'http://localhost:3000/signin',
        },
      });
    });
  });

  describe('Rendering', () => {
    it('displays logout text and icon', () => {
      render(<LogoutButton />);

      expect(screen.getByText('Logout')).toBeInTheDocument();
      expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    });
  });
});
