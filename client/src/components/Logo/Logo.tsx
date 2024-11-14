/// <reference types="vite-plugin-svgr/client" />
import { FC } from 'react';

import TaskMasterLogo from '../../assets/taskmaster-logo.svg?react';

import { LogoContainer, StyledTitle } from './Logo.styled';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withTitle?: boolean;
}

export const Logo: FC<LogoProps> = ({ size = 'medium', withTitle = false }) => {
  return (
    <LogoContainer>
      <TaskMasterLogo />
      {withTitle && (
        <StyledTitle size={size} variant='h1'>
          TaskMaster
        </StyledTitle>
      )}
    </LogoContainer>
  );
};
