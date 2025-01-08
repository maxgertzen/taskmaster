import { ReactNode } from 'react';
import { beforeEach, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';
import { IconName } from '@/shared/types/icons';

import {
  mockListsApi,
  mockTasksApi,
  resetAllMocks,
} from './__mocks__/apiMocks';
import SvgMock from './__mocks__/svgMock';

vi.mock('@/shared/store/themeStore', () => ({
  useThemeStore: (selector: (state: { theme: string }) => unknown) =>
    selector({ theme: 'light' }),
}));

vi.mock('@/shared/assets/icons', () => ({
  iconMap: {
    a2z: SvgMock('a2z'),
    arrowButton: SvgMock('arrowButton'),
    closepanel: SvgMock('closepanel'),
    drag: SvgMock('drag'),
    dragDark: SvgMock('dragDark'),
    exit: SvgMock('exit'),
    'hamburger-menu': SvgMock('hamburger-menu'),
    'hamburger-menuDark': SvgMock('hamburger-menuDark'),
    home: SvgMock('home'),
    homeDark: SvgMock('homeDark'),
    list: SvgMock('list'),
    listDark: SvgMock('listDark'),
    logout: SvgMock('logout'),
    magnifying: SvgMock('magnifying'),
    magnifyingDark: SvgMock('magnifyingDark'),
    moon: SvgMock('moon'),
    openpanel: SvgMock('openpanel'),
    pencil: SvgMock('pencil'),
    pencilDark: SvgMock('pencilDark'),
    plus: SvgMock('plus'),
    plusDark: SvgMock('plusDark'),
    sun: SvgMock('sun'),
    'three-dots': SvgMock('three-dots'),
    'three-dotsDark': SvgMock('three-dotsDark'),
    trash: SvgMock('trash'),
    trashDark: SvgMock('trashDark'),
    user: SvgMock('user'),
    userDark: SvgMock('userDark'),
    'x-button': SvgMock('x-button'),
    'x-buttonDark': SvgMock('x-buttonDark'),
    z2a: SvgMock('z2a'),
  } as Record<IconName, () => ReactNode>,
}));

vi.mock('@/features/tasks/api', () => mockTasksApi);
vi.mock('@/features/lists/api', () => mockListsApi);

beforeEach(() => {
  resetAllMocks();
});
