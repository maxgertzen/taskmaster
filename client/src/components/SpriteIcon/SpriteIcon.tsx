/// <reference types="vite-plugin-svgr/client" />
import { FC, FunctionComponent, useMemo } from 'react';

import a2z from '../../assets/sprites/icons/a2z.svg?react';
import closepanel from '../../assets/sprites/icons/closepanel.svg?react';
import dragDark from '../../assets/sprites/icons/drag-dm.svg?react';
import drag from '../../assets/sprites/icons/drag.svg?react';
import hamburgerMenuDark from '../../assets/sprites/icons/hamburger-menu-dm.svg?react';
import hamburgerMenu from '../../assets/sprites/icons/hamburger-menu.svg?react';
import listDark from '../../assets/sprites/icons/list-dm.svg?react';
import list from '../../assets/sprites/icons/list.svg?react';
import logout from '../../assets/sprites/icons/logout.svg?react';
import magnifyingDark from '../../assets/sprites/icons/magnifying-dm.svg?react';
import magnifying from '../../assets/sprites/icons/magnifying.svg?react';
import moon from '../../assets/sprites/icons/moon.svg?react';
import openpanel from '../../assets/sprites/icons/openpanel.svg?react';
import pencilDark from '../../assets/sprites/icons/pencil-dm.svg?react';
import pencil from '../../assets/sprites/icons/pencil.svg?react';
import plusDark from '../../assets/sprites/icons/plus-dm.svg?react';
import plus from '../../assets/sprites/icons/plus.svg?react';
import sun from '../../assets/sprites/icons/sun.svg?react';
import threeDotsDark from '../../assets/sprites/icons/three-dots-dm.svg?react';
import threeDots from '../../assets/sprites/icons/three-dots.svg?react';
import trashDark from '../../assets/sprites/icons/trash-dm.svg?react';
import trash from '../../assets/sprites/icons/trash.svg?react';
import userDark from '../../assets/sprites/icons/user-dm.svg?react';
import user from '../../assets/sprites/icons/user.svg?react';
import xButtonDark from '../../assets/sprites/icons/x-button-dm.svg?react';
import xButton from '../../assets/sprites/icons/x-button.svg?react';
import z2a from '../../assets/sprites/icons/z2a.svg?react';
import { useThemeStore } from '../../store/themeStore';
import { IconName } from '../../types/icons';

import { StyledIconWrapper } from './SpriteIcon.styled';

interface SpriteIconProps {
  name: IconName;
  alt?: string;
  size?: number;
  isVisible?: boolean;
  onClick?: () => void;
}

const iconMap: Record<
  IconName,
  FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  a2z,
  closepanel,
  drag,
  dragDark,
  'hamburger-menu': hamburgerMenu,
  'hamburger-menuDark': hamburgerMenuDark,
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

  return (
    <StyledIconWrapper
      applyInvert={applyInvert}
      size={size}
      role='button'
      isVisible={isVisible}
    >
      <Svg height='100%' style={{ position: 'relative' }} onClick={onClick}>
        <title>{alt}</title>
      </Svg>
    </StyledIconWrapper>
  );
};
