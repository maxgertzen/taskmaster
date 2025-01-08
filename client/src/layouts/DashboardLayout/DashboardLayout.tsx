import { FC, Fragment, ReactNode } from 'react';

import { Header, SpotlightOverlay } from '@/features/ui/components';
import { useViewportStore } from '@/shared/store/viewportStore';
import { UserDetails } from '@/shared/types/shared';

import { SelectedView } from '../../shared/types/ui';

import {
  DashboardContainer,
  MainLayout,
  SwipeContainer,
} from './DashboardLayout.styled';

interface DashboardLayoutProps {
  children: ReactNode;
  user: UserDetails | null;
  view?: SelectedView;
  onBack?: () => void;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({
  children,
  user,
  view,
  onBack,
}) => {
  const isMobile = useViewportStore((state) => state.isMobile);

  return (
    <Fragment>
      <SpotlightOverlay />
      <DashboardContainer>
        <Header user={user} view={view} onBack={onBack} />
        {isMobile ? (
          <SwipeContainer view={view}>{children}</SwipeContainer>
        ) : (
          <MainLayout>{children}</MainLayout>
        )}
      </DashboardContainer>
    </Fragment>
  );
};
