import { FC } from 'react';

import taskMasterGrayScaleUrl from '../../assets/taskmaster-grayscale.png';
import taskMasterUrl from '../../assets/taskmaster.png';
import { useThemeStore } from '../../store/themeStore';

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
        src={themeMode === 'dark' ? taskMasterGrayScaleUrl : taskMasterUrl}
        alt='TaskMaster Logo'
      />
      {withTitle && (
        <StyledTitle size={size} variant='h1'>
          TaskMaster
        </StyledTitle>
      )}
    </LogoContainer>
  );
};
