import { FC, useState } from 'react';

import { withAuthenticationRequired } from '../../auth/withAuthenticationRequired';
import { Header, Sidebar, TaskPanel, Loader } from '../../components';
import { useAuthStore } from '../../store/authStore';
import {
  useTaskStore,
  useUserStore,
  useViewportStore,
} from '../../store/store';

import {
  DashboardContainer,
  MainLayout,
  SwipeContainer,
} from './DashboardPage.styled';

const Dashboard: FC = () => {
  const token = useAuthStore((state) => state.token);
  const { selectedListId, setSelectedListId } = useTaskStore((state) => state);
  const userDetails = useUserStore((state) => state.user);
  const isMobile = useViewportStore((state) => state.isMobile);
  const [view, setView] = useState<'sidebar' | 'taskPanel'>('sidebar');
  const setSearchTerm = useTaskStore((state) => state.setSearchTerm);

  const handleOnSelectList = (listId: string | null) => {
    setSelectedListId(listId);
    if (listId) {
      setSearchTerm('');
    }
    if (isMobile && listId) {
      setView('taskPanel');
    }
  };

  const handleOnBack = () => {
    if (view === 'taskPanel') {
      setSelectedListId(null);
      setView('sidebar');
    }
  };

  if (!token) {
    return (
      <DashboardContainer isFullPage>
        <Loader />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header
        user={userDetails}
        onBack={view === 'taskPanel' ? handleOnBack : undefined}
      />
      {isMobile ? (
        <SwipeContainer view={view}>
          <Sidebar
            selectedListId={selectedListId}
            onSelectList={handleOnSelectList}
          />
          <TaskPanel listId={selectedListId} />
        </SwipeContainer>
      ) : (
        <MainLayout>
          <Sidebar
            selectedListId={selectedListId}
            onSelectList={handleOnSelectList}
          />
          <TaskPanel listId={selectedListId} />
        </MainLayout>
      )}
    </DashboardContainer>
  );
};

export const DashboardPage = withAuthenticationRequired(Dashboard, {
  onRedirecting: () => (
    <DashboardContainer isFullPage>
      <Loader />
    </DashboardContainer>
  ),
  returnTo: '/',
});
