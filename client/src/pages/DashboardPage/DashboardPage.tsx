import { withAuthenticationRequired } from '@auth0/auth0-react';
import { FC, Suspense, useEffect, useState } from 'react';

import {
  ListSidebar,
  TaskList,
  AddTaskInput,
  Header,
  FaIcon,
  ResizableHandle,
} from '../../components';
import { LogoutButton } from '../../components/LogoutButton/LogoutButton';
import { useLists } from '../../hooks/useLists';
import { useTasksMutation } from '../../hooks/useTaskMutation';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore, useUserStore } from '../../store/store';

import {
  DashboardContainer,
  MainLayout,
  SidebarContainer,
  StyledCollapsibleButton,
  TaskContainer,
} from './DashboardPage.styled';

// TODO:
// - Add a search bar to search for tasks
// - Add a filter to filter tasks by completed or not
// - Add a button to mark all tasks as completed
// - Add a button to delete all tasks
// - Add a button to delete completed tasks
const Dashboard: FC = () => {
  const token = useAuthStore((state) => state.token);
  const selectedListId = useTaskStore((state) => state.selectedListId);
  const setSelectedListId = useTaskStore((state) => state.setSelectedListId);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);

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

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [isResizing]);

  return token && lists ? (
    <DashboardContainer>
      <Header user={userDetails} />
      <MainLayout>
        <SidebarContainer isCollapsed={isCollapsed} width={sidebarWidth}>
          <StyledCollapsibleButton
            isCollapsed={isCollapsed}
            onClick={handleToggleSidebar}
          >
            <FaIcon icon={['far', 'square-caret-left']} size='lg' />
          </StyledCollapsibleButton>
          <Suspense fallback={<div>Loading lists...</div>}>
            {!isCollapsed && (
              <ListSidebar
                lists={lists}
                selectedList={selectedListId}
                onSelectList={handleSelectList}
                onDeleteList={handleDeleteList}
              />
            )}
          </Suspense>
          {!isCollapsed && <LogoutButton />}
          <ResizableHandle
            initialWidth={sidebarWidth}
            setWidth={setSidebarWidth}
            onResize={(isResizing) => setIsResizing(isResizing)}
          />
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
  ) : (
    <div>Loading...</div>
  );
};

export const DashboardPage = withAuthenticationRequired(Dashboard, {
  onRedirecting: () => <div>Loading...</div>,
  returnTo: '/',
});
