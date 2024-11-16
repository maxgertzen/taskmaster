import { withAuthenticationRequired } from '@auth0/auth0-react';
import { FC } from 'react';

import { Header, Sidebar, TaskPanel } from '../../components';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore, useUserStore } from '../../store/store';

import { DashboardContainer, MainLayout } from './DashboardPage.styled';

// TODO:
// - Add a search bar to search for tasks
// - Add a filter to filter tasks by completed or not
// - Add a button to mark all tasks as completed
// - Add a button to delete all tasks
// - Add a button to delete completed tasks
const Dashboard: FC = () => {
  const token = useAuthStore((state) => state.token);
  const { selectedListId, setSelectedListId } = useTaskStore((state) => state);

  const userDetails = useUserStore((state) => state.user);

  return token ? (
    <DashboardContainer>
      <Header user={userDetails} />
      <MainLayout>
        <Sidebar
          selectedListId={selectedListId}
          onSelectList={setSelectedListId}
        />
        <TaskPanel selectedListId={selectedListId} />
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
