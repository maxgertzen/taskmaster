import { vi } from 'vitest';

import '@testing-library/jest-dom/vitest';
import { IconName } from '@/shared/types/icons';

import SvgMock from './__mocks__/svgMock';

vi.mock('@/shared/store/themeStore', () => ({
  useThemeStore: (selector: (state: { theme: string }) => unknown) =>
    selector({ theme: 'light' }),
}));

vi.mock('@/shared/assets/icons', () => ({
  iconMap: {
    a2z: SvgMock,
    arrowButton: SvgMock,
    closepanel: SvgMock,
    drag: SvgMock,
    dragDark: SvgMock,
    exit: SvgMock,
    'hamburger-menu': SvgMock,
    'hamburger-menuDark': SvgMock,
    home: SvgMock,
    homeDark: SvgMock,
    list: SvgMock,
    listDark: SvgMock,
    logout: SvgMock,
    magnifying: SvgMock,
    magnifyingDark: SvgMock,
    moon: SvgMock,
    openpanel: SvgMock,
    pencil: SvgMock,
    pencilDark: SvgMock,
    plus: SvgMock,
    plusDark: SvgMock,
    sun: SvgMock,
    'three-dots': SvgMock,
    'three-dotsDark': SvgMock,
    trash: SvgMock,
    trashDark: SvgMock,
    user: SvgMock,
    userDark: SvgMock,
    'x-button': SvgMock,
    'x-buttonDark': SvgMock,
    z2a: SvgMock,
  } as Record<IconName, typeof SvgMock>,
}));
