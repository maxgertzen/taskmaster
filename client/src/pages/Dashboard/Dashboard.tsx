import { FC, Suspense } from 'react';

import { ListSidebar, TaskList, AddTaskInput, Header } from '../../components';
import { useLists } from '../../hooks/useLists';
import { useTasksMutation } from '../../hooks/useTaskMutation';
import { useTaskStore, useUserStore } from '../../store/store';

import {
  DashboardContainer,
  MainLayout,
  SidebarContainer,
  TaskContainer,
} from './Dashboard.styled';

export const Dashboard: FC = () => {
  const selectedListId = useTaskStore((state) => state.selectedListId);
  const setSelectedListId = useTaskStore((state) => state.setSelectedListId);

  const userDetails = useUserStore((state) => state.user);

  const { lists } = useLists();

  const addTask = useTasksMutation('add');

  const handleAddTask = async (task: string) => {
    await addTask.mutateAsync({ listId: selectedListId, text: task });
  };

  const handleSelectList = (listId: string) => () => {
    if (selectedListId !== listId) setSelectedListId(listId);
    else setSelectedListId(null);
  };

  const handleDeleteList = () => {
    setSelectedListId(null);
  };

  return (
    <DashboardContainer>
      <Header user={userDetails} />
      <MainLayout>
        <SidebarContainer>
          <Suspense fallback={<div>Loading lists...</div>}>
            <ListSidebar
              lists={lists}
              selectedList={selectedListId}
              onSelectList={handleSelectList}
              onDeleteList={handleDeleteList}
            />
          </Suspense>
        </SidebarContainer>
        <TaskContainer>
          <Suspense fallback={<div>Loading tasks...</div>}>
            {selectedListId ? (
              <>
                <h4>
                  {lists.find((list) => list.id === selectedListId)?.name}
                </h4>
                <AddTaskInput onAddTask={handleAddTask} />
                <TaskList selectedListId={selectedListId} />
              </>
            ) : (
              <h4>Select a list to view tasks</h4>
            )}
          </Suspense>
        </TaskContainer>
      </MainLayout>
    </DashboardContainer>
  );
};
