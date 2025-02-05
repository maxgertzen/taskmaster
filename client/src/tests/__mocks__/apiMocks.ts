import { Mock, vi } from 'vitest';

import { List, Task } from '@/shared/types/shared';

import { ListsApi, TasksApi } from './types';

export const mockTasksApi: { [K in keyof TasksApi]: Mock } = {
  getTasks: vi.fn(),
  addTask: vi.fn(),
  editTask: vi.fn(),
  deleteTask: vi.fn(),
  reorderTask: vi.fn(),
  toggleComplete: vi.fn(),
  bulkDelete: vi.fn(),
  searchTasks: vi.fn(),
};

export const mockListsApi: { [K in keyof ListsApi]: Mock } = {
  getLists: vi.fn(),
  addList: vi.fn(),
  editList: vi.fn(),
  deleteList: vi.fn(),
  reorderList: vi.fn(),
};

export const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: String(Date.now()),
  text: 'Mock Task',
  completed: false,
  listId: null,
  ...overrides,
});

export const createMockList = (overrides: Partial<List> = {}): List => ({
  id: String(Date.now()),
  name: 'Mock List',
  ...overrides,
});

export const setupMockTasks = (listId: string | null = null) => {
  const tasks: Task[] = [
    createMockTask({ id: '1', text: 'Task 1', listId }),
    createMockTask({ id: '2', text: 'Task 2', completed: true, listId }),
    createMockTask({ id: '3', text: 'Task 3', listId }),
  ];

  mockTasksApi.getTasks.mockImplementation(({ filter }) => {
    let filteredTasks = [...tasks];

    if (filter === 'active') {
      filteredTasks = tasks.filter((task) => !task.completed);
    } else if (filter === 'completed') {
      filteredTasks = tasks.filter((task) => task.completed);
    }

    return Promise.resolve(filteredTasks);
  });

  mockTasksApi.addTask.mockImplementation(({ text, listId }) =>
    Promise.resolve(createMockTask({ text, listId }))
  );

  mockTasksApi.editTask.mockImplementation(({ id, ...updates }) =>
    Promise.resolve(createMockTask({ id, ...updates }))
  );

  mockTasksApi.toggleComplete.mockImplementation(({ completed }) => {
    tasks.forEach((task) => (task.completed = completed));
    return Promise.resolve();
  });

  mockTasksApi.bulkDelete.mockImplementation(({ deleteMode }) => {
    if (deleteMode === 'completed') {
      tasks.filter((task) => !task.completed);
    } else {
      tasks.length = 0;
    }
    return Promise.resolve();
  });

  return tasks;
};

export const setupMockLists = () => {
  const lists: List[] = [
    createMockList({ id: 'list1', name: 'Work' }),
    createMockList({ id: 'list2', name: 'Personal' }),
  ];

  mockListsApi.getLists.mockResolvedValue(lists);

  mockListsApi.addList.mockImplementation(({ name }) =>
    Promise.resolve(createMockList({ name }))
  );

  mockListsApi.editList.mockImplementation(({ listId, name }) =>
    Promise.resolve(createMockList({ id: listId, name }))
  );

  return lists;
};

export const resetAllMocks = () => {
  vi.clearAllMocks();
  Object.values(mockTasksApi).forEach((mock) => mock.mockReset());
  Object.values(mockListsApi).forEach((mock) => mock.mockReset());
};
