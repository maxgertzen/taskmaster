import { Task } from '../types/shared';

export const fetchMockLists = async () => {
  return [
    { id: '1', name: 'Work' },
    { id: '2', name: 'Personal' },
    { id: '3', name: 'Shopping' },
  ];
};

export const fetchMockTasks = async (listId: string) => {
  const tasks: Record<string, Task[]> = {
    '1': [
      { id: '1', text: 'Task 1' },
      { id: '2', text: 'Task 2' },
    ],
    '2': [
      { id: '3', text: 'Task A' },
      { id: '4', text: 'Task B' },
    ],
    '3': [
      { id: '5', text: 'Buy Milk' },
      { id: '6', text: 'Buy Bread' },
    ],
  };

  return tasks[listId] || [];
};
