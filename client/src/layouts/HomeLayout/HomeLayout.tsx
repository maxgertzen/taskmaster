import { FC, ReactNode } from 'react';

import { Logo } from '@/features/ui/components';

import { HomeLayoutContainer, CenteredContent } from './HomeLayout.styled';

interface HomeLayoutProps {
  children: ReactNode;
}

export const HomeLayout: FC<HomeLayoutProps> = ({ children }) => (
  <HomeLayoutContainer>
    <CenteredContent>
      <Logo />
      {children}
    </CenteredContent>
  </HomeLayoutContainer>
);
