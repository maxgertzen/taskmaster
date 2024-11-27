import { Task, List } from '../types/shared';
import { reorderArray } from '../utils/reorderArray';

let mockLists: List[] = [
  { id: '1', name: 'Work' },
  { id: '2', name: 'Personal' },
  { id: '3', name: 'Shopping' },
];

const tasks: Record<string, Task[]> = {
  '1': [
    { id: '1', text: 'Task 1', completed: false, listId: '1' },
    { id: '2', text: 'Task 2', completed: false, listId: '1' },
  ],
  '2': [
    { id: '3', text: 'Task A', completed: false, listId: '2' },
    { id: '4', text: 'Task B', completed: false, listId: '2' },
  ],
  '3': [
    { id: '5', text: 'Buy Milk', completed: false, listId: '3' },
    { id: '6', text: 'Buy Bread', completed: false, listId: '3' },
  ],
};

export const fetchMockLists = async (): Promise<List[]> => {
  return mockLists;
};

export const fetchMockTasks = async (listId: string): Promise<Task[]> => {
  return tasks[listId] || [];
};

export const mockAddTask = async (
  listId: string,
  text: string
): Promise<Task> => {
  const newTask = { id: Date.now().toString(), text, completed: false, listId };
  if (!tasks[listId]) {
    tasks[listId] = [];
  }
  tasks[listId].push(newTask);
  return newTask;
};

export const mockEditTask = async (
  taskId: string,
  listId: string | null,
  updates: Partial<Task>
): Promise<void> => {
  if (!listId || !tasks[listId]) return;

  tasks[listId] = tasks[listId].map((task) =>
    task.id === taskId ? { ...task, ...updates } : task
  );
};

export const mockDeleteTask = async (
  taskId: string,
  listId: string
): Promise<{ id: string }> => {
  if (tasks[listId]) {
    tasks[listId] = tasks[listId].filter((task) => task.id !== taskId);
  }
  return { id: taskId };
};

export const mockReorderTasks = async (
  listId: string,
  oldIndex: number,
  newIndex: number
): Promise<Task[]> => {
  if (!tasks[listId]) return [];
  tasks[listId] = reorderArray(tasks[listId], oldIndex, newIndex);
  return tasks[listId];
};

export const mockReorderLists = async (
  oldIndex: number,
  newIndex: number
): Promise<List[]> => {
  const reorderedLists = reorderArray(mockLists, oldIndex, newIndex);
  mockLists = reorderedLists;
  return reorderedLists;
};

export const mockAddList = async (name: string): Promise<List> => {
  const newList = { id: Date.now().toString(), name };
  mockLists.push(newList);
  tasks[newList.id] = [];
  return newList;
};

export const mockEditList = async (
  listId: string,
  name: string
): Promise<List | undefined> => {
  const existingList = mockLists.find((list) => list.id === listId);
  if (existingList) {
    Object.assign(existingList, { name });
    return existingList;
  }
};

export const mockDeleteList = async (
  listId: string
): Promise<{ id: string }> => {
  mockLists = mockLists.filter((list) => list.id !== listId);
  delete tasks[listId];
  return { id: listId };
};
