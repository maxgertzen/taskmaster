import { FC, Suspense } from 'react';

import { ListSidebar, TaskList } from '../../components';
import { Header } from '../../components/Header/Header';
import { useLists } from '../../hooks/useLists';
import { useTaskStore, useUserStore } from '../../store/store';

import {
  DashboardContainer,
  MainLayout,
  SidebarContainer,
  TaskContainer,
} from './Dashboard.styled';

// TODO:
// - Implement a way to select a list
// - Implement a way to add a new list
// - Implement a way to remove a list
// - Implement a way to edit a list
// - Implement a way to reorder lists
export const Dashboard: FC = () => {
  const selectedListId = useTaskStore((state) => state.selectedListId);
  // const setSelectedListId = useTaskStore((state) => state.setSelectedListId);

  const userDetails = useUserStore((state) => state.user);

  const { lists } = useLists();

  return (
    <DashboardContainer>
      <Header user={userDetails} />
      <MainLayout>
        <SidebarContainer>
          <Suspense fallback={<div>Loading lists...</div>}>
            <ListSidebar lists={lists} /* onSelectList={setSelectedListId} */ />
          </Suspense>
        </SidebarContainer>
        <TaskContainer>
          <Suspense fallback={<div>Loading tasks...</div>}>
            <TaskList selectedListId={selectedListId} />
          </Suspense>
        </TaskContainer>
      </MainLayout>
    </DashboardContainer>
  );
};
