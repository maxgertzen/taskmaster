import { FC, MouseEventHandler, useMemo } from 'react';

import { iconMap } from '@/shared/assets/icons';
import { useThemeStore } from '@/shared/store/themeStore';
import { IconName } from '@/shared/types/icons';

import { StyledIconWrapper } from './SpriteIcon.styled';

interface SpriteIconProps {
  name: IconName;
  alt?: string;
  size?: number;
  isVisible?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  'data-testid'?: string;
}

export const SpriteIcon: FC<SpriteIconProps> = ({
  name,
  alt = 'icon',
  size = 3,
  isVisible = true,
  'data-testid': dataTestId,
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
      data-testid={dataTestId ?? `icon-${name}`}
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
