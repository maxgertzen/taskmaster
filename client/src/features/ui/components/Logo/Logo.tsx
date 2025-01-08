import { FC } from 'react';

import taskMasterGrayScaleUrl from '@/shared/assets/images/taskmaster-grayscale.png';
import taskMasterUrl from '@/shared/assets/images/taskmaster.png';
import { useThemeStore } from '@/shared/store/themeStore';

import {
  LogoContainer,
  StyledTitle,
  TaskMasterLogoComponent,
} from './Logo.styled';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withTitle?: boolean;
}

export const Logo: FC<LogoProps> = ({ size = 'medium', withTitle = false }) => {
  const themeMode = useThemeStore((state) => state.theme);
  return (
    <LogoContainer>
      <TaskMasterLogoComponent
        data-testid='logo'
        src={themeMode === 'dark' ? taskMasterGrayScaleUrl : taskMasterUrl}
        alt='TaskMaster Logo'
      />
      {withTitle && <StyledTitle size={size}>TaskMaster</StyledTitle>}
    </LogoContainer>
  );
};
