/// <reference types="vite-plugin-svgr/client" />
import { FC, FunctionComponent, MouseEventHandler, useMemo } from 'react';

import a2z from '@/shared/assets/icons/a2z.svg?react';
import arrowButton from '@/shared/assets/icons/arrow-left.svg?react';
import closepanel from '@/shared/assets/icons/closepanel.svg?react';
import dragDark from '@/shared/assets/icons/drag-dm.svg?react';
import drag from '@/shared/assets/icons/drag.svg?react';
import exit from '@/shared/assets/icons/exit.svg?react';
import hamburgerMenuDark from '@/shared/assets/icons/hamburger-menu-dm.svg?react';
import hamburgerMenu from '@/shared/assets/icons/hamburger-menu.svg?react';
import homeDark from '@/shared/assets/icons/home-dm.svg?react';
import home from '@/shared/assets/icons/home.svg?react';
import listDark from '@/shared/assets/icons/list-dm.svg?react';
import list from '@/shared/assets/icons/list.svg?react';
import logout from '@/shared/assets/icons/logout.svg?react';
import magnifyingDark from '@/shared/assets/icons/magnifying-dm.svg?react';
import magnifying from '@/shared/assets/icons/magnifying.svg?react';
import moon from '@/shared/assets/icons/moon.svg?react';
import openpanel from '@/shared/assets/icons/openpanel.svg?react';
import pencilDark from '@/shared/assets/icons/pencil-dm.svg?react';
import pencil from '@/shared/assets/icons/pencil.svg?react';
import plusDark from '@/shared/assets/icons/plus-dm.svg?react';
import plus from '@/shared/assets/icons/plus.svg?react';
import sun from '@/shared/assets/icons/sun.svg?react';
import threeDotsDark from '@/shared/assets/icons/three-dots-dm.svg?react';
import threeDots from '@/shared/assets/icons/three-dots.svg?react';
import trashDark from '@/shared/assets/icons/trash-dm.svg?react';
import trash from '@/shared/assets/icons/trash.svg?react';
import userDark from '@/shared/assets/icons/user-dm.svg?react';
import user from '@/shared/assets/icons/user.svg?react';
import xButtonDark from '@/shared/assets/icons/x-button-dm.svg?react';
import xButton from '@/shared/assets/icons/x-button.svg?react';
import z2a from '@/shared/assets/icons/z2a.svg?react';
import { useThemeStore } from '@/shared/store/themeStore';
import { IconName } from '@/shared/types/icons';

import { StyledIconWrapper } from './SpriteIcon.styled';

interface SpriteIconProps {
  name: IconName;
  alt?: string;
  size?: number;
  isVisible?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const iconMap: Record<
  IconName,
  FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  a2z,
  arrowButton,
  closepanel,
  drag,
  dragDark,
  exit,
  'hamburger-menu': hamburgerMenu,
  'hamburger-menuDark': hamburgerMenuDark,
  home,
  homeDark,
  list,
  listDark,
  logout,
  magnifying,
  magnifyingDark,
  moon,
  openpanel,
  pencil,
  pencilDark,
  plus,
  plusDark,
  sun,
  'three-dots': threeDots,
  'three-dotsDark': threeDotsDark,
  trash,
  trashDark,
  user,
  userDark,
  'x-button': xButton,
  'x-buttonDark': xButtonDark,
  z2a,
};

export const SpriteIcon: FC<SpriteIconProps> = ({
  name,
  alt = 'icon',
  size = 3,
  isVisible = true,
  onClick,
}) => {
  const mode = useThemeStore((state) => state.theme);

  const Svg = useMemo(() => {
    if (mode === 'dark' && iconMap[`${name}Dark` as IconName]) {
      return iconMap[`${name}Dark` as IconName];
    }
    return iconMap[name];
  }, [mode, name]);

  const applyInvert = useMemo(() => {
    return (
      mode === 'dark' && name !== 'sun' && !iconMap[`${name}Dark` as IconName]
    );
  }, [mode, name]);

  const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <StyledIconWrapper
      applyInvert={applyInvert}
      size={size}
      role='button'
      isVisible={isVisible}
      onClick={onClick ? handleOnClick : undefined}
    >
      <Svg height='100%' style={{ position: 'relative' }}>
        <title>{alt}</title>
      </Svg>
    </StyledIconWrapper>
  );
};
