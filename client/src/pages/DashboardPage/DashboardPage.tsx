import { withAuthenticationRequired } from '@auth0/auth0-react';
import { FC } from 'react';

import { Header, Sidebar, TaskPanel } from '../../components';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore, useUserStore } from '../../store/store';

import { DashboardContainer, MainLayout } from './DashboardPage.styled';

// TODO
// 1. Create a loader component - this will be used to show a loading spinner
// 2. Ensure debounce is working correctly
// 3. Add due date to the task item
// 4. Update the styling of the project to use Material UI
const Dashboard: FC = () => {
  const token = useAuthStore((state) => state.token);
  const { selectedListId, setSelectedListId } = useTaskStore((state) => state);
  const setSearchTerm = useTaskStore((state) => state.setSearchTerm);

  const userDetails = useUserStore((state) => state.user);

  const handleOnSelectList = (listId: string | null) => {
    setSelectedListId(listId);
    if (listId) {
      setSearchTerm('');
    }
  };

  return token ? (
    <DashboardContainer>
      <Header user={userDetails} />
      <MainLayout>
        <Sidebar
          selectedListId={selectedListId}
          onSelectList={handleOnSelectList}
        />
        <TaskPanel listId={selectedListId} />
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
