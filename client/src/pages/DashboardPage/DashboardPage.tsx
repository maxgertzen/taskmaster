import { useQueryClient } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';

import { useLists } from '@/features/lists/hooks/useLists';
import { SidebarLayout } from '@/features/lists/layouts/Sidebar';
import { TaskArea } from '@/features/tasks/layouts/TaskArea/TaskArea';
import { prefetchTasksForLists } from '@/features/tasks/utils/prefetchTasksForLists';
import { Loader } from '@/features/ui/components';
import { DashboardLayout } from '@/layouts/DashboardLayout/DashboardLayout';
import { useAuthStore } from '@/shared/store/authStore';
import { useDashboardStore } from '@/shared/store/dashboardStore';
import { useViewportStore } from '@/shared/store/viewportStore';
import { List } from '@/shared/types/shared';
import { SelectedView } from '@/shared/types/ui';
import { withAuthenticationRequired } from '@/shared/utils/withAuthenticationRequired';

import { DashboardContainer } from './DashboardPage.styled';

const Dashboard: FC = () => {
  const { token, user } = useAuthStore((state) => state);
  const { lists } = useLists();
  const {
    selectedList,
    searchTerm,
    setSelectedList,
    resetSelectedList,
    setSearchTerm,
  } = useDashboardStore((state) => state);
  const isMobile = useViewportStore((state) => state.isMobile);
  const [view, setView] = useState<SelectedView>('list');
  const queryClient = useQueryClient();

  const handleOnSelectList = (list: List | null) => {
    setSelectedList(list);
    if (list) {
      setSearchTerm('');
    }
    if (isMobile && list) {
      setView('board');
    }
  };

  const handleOnBack = () => {
    if (view === 'board') {
      if (selectedList == null) {
        setSearchTerm('');
      } else {
        resetSelectedList();
      }

      setView('list');
    }
  };

  useEffect(() => {
    if (selectedList == null && searchTerm) {
      setView('board');
    }
  }, [selectedList, searchTerm]);

  useEffect(() => {
    if (lists?.length) {
      const listIdsToPrefetch = lists.slice(0, 3).map((list) => list.id);
      prefetchTasksForLists(listIdsToPrefetch, queryClient, token);
    }
  }, [lists, token, queryClient]);

  if (!token) {
    return (
      <DashboardContainer isFullPage>
        <Loader />
      </DashboardContainer>
    );
  }

  return (
    <DashboardLayout user={user} view={view} onBack={handleOnBack}>
      <SidebarLayout
        lists={lists}
        selectedList={selectedList}
        onSelectList={handleOnSelectList}
      />
      <TaskArea selectedList={selectedList} />
    </DashboardLayout>
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
