import { FC, Suspense } from 'react';

import { ListSidebar, TaskList } from '../../components';
import { useLists } from '../../hooks/useLists';
import { useTaskStore } from '../../store/store';

// TODO:
// - Implement a way to select a list
// - Implement a way to add a new list
// - Implement a way to remove a list
// - Implement a way to edit a list
// - Implement a way to reorder lists
export const Dashboard: FC = () => {
  const selectedListId = useTaskStore((state) => state.selectedListId);
  // const setSelectedListId = useTaskStore((state) => state.setSelectedListId);

  const { lists } = useLists();

  return (
    <div>
      <Suspense fallback={<div>Loading lists...</div>}>
        <ListSidebar lists={lists} /* onSelectList={setSelectedListId} */ />
      </Suspense>
      <Suspense fallback={<div>Loading tasks...</div>}>
        <TaskList selectedListId={selectedListId} />
      </Suspense>
    </div>
  );
};
