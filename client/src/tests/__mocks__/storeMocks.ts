import { vi } from 'vitest';

import type { PopupMenuState } from '@/shared/hooks/usePopupMenuState';
import type { DashboardStore } from '@/shared/store/dashboardStore';
import type { SpotlightStore } from '@/shared/store/spotlightStore';
import type { ThemeStore } from '@/shared/store/themeStore';
import type { ViewportStore } from '@/shared/store/viewportStore';

export const mockSelectedList = { id: 'test-list-id', name: 'Test List' };
export const mockSetSelectedList = vi.fn();

export const mockSetSearchTerm = vi.fn();
export const mockSearchTerm = '';

export const mockDashboardStore = (
  selector: (state: DashboardStore) => unknown
) =>
  selector({
    searchTerm: mockSearchTerm,
    selectedList: mockSelectedList,
    setSelectedList: mockSetSelectedList,
    setSearchTerm: mockSetSearchTerm,
  } as DashboardStore);

export const mockIsMobile = vi.fn().mockReturnValue(false);
export const mockViewportStore = (
  selector: (state: ViewportStore) => unknown
) => selector({ isMobile: mockIsMobile() } as ViewportStore);

export const mockCloseMenu = vi.fn();
export const mockToggleMenu = vi.fn();
export const mockPopupMenuState = (): PopupMenuState => ({
  closeMenu: mockCloseMenu,
  isOpen: false,
  toggleMenu: mockToggleMenu,
  openMenu: vi.fn(),
});

export const mockUseSpotlightStore = vi.fn();
export const mockSpotlightStore = (
  selector: (state: SpotlightStore) => unknown
) => selector({ spotlightTarget: mockUseSpotlightStore() } as SpotlightStore);

export const mockThemeStoreMode = vi.fn().mockReturnValue('light');
export const mockToggleTheme = vi.fn();
export const mockThemeStore = (selector: (state: ThemeStore) => unknown) =>
  selector({
    theme: mockThemeStoreMode(),
    toggleTheme: mockToggleTheme,
  } as ThemeStore);
