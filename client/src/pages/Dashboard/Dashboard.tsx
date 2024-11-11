import { FC, Suspense } from 'react';

import { ListSidebar, TaskList, AddTaskInput, Header } from '../../components';
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
  const selectedListId = useTaskStore((state) => state.selectedListId ?? '1');
  // const setSelectedListId = useTaskStore((state) => state.setSelectedListId);

  const userDetails = useUserStore((state) => state.user);

  const { lists } = useLists();

  const handleAddTask = (task: string) => {
    console.log(task);
  };

  return (
    <DashboardContainer>
      <Header user={userDetails} />
      <MainLayout>
        <SidebarContainer>
          <Suspense fallback={<div>Loading lists...</div>}>
            <ListSidebar
              lists={lists}
              selectedList={
                selectedListId
              } /* onSelectList={setSelectedListId} */
            />
          </Suspense>
        </SidebarContainer>
        <TaskContainer>
          <Suspense fallback={<div>Loading tasks...</div>}>
            <h4>{lists.find((list) => list.id === selectedListId)?.name}</h4>
            <AddTaskInput onAddTask={handleAddTask} />
            <TaskList selectedListId={selectedListId} />
          </Suspense>
        </TaskContainer>
      </MainLayout>
    </DashboardContainer>
  );
};
