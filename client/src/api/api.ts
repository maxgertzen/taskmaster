import { Task, List } from '../types/shared';

const mockLists = new Set<List>([
  { id: '1', name: 'Work' },
  { id: '2', name: 'Personal' },
  { id: '3', name: 'Shopping' },
]);

const tasks: Record<string, Set<Task>> = {
  '1': new Set([
    { id: '1', text: 'Task 1', completed: false },
    { id: '2', text: 'Task 2', completed: false },
  ]),
  '2': new Set([
    { id: '3', text: 'Task A', completed: false },
    { id: '4', text: 'Task B', completed: false },
  ]),
  '3': new Set([
    { id: '5', text: 'Buy Milk', completed: false },
    { id: '6', text: 'Buy Bread', completed: false },
  ]),
};

export const fetchMockLists = async (): Promise<List[]> => {
  return Array.from(mockLists);
};

export const fetchMockTasks = async (listId: string): Promise<Task[]> => {
  return tasks[listId] ? Array.from(tasks[listId]) : [];
};

export const mockAddTask = async (
  listId: string,
  text: string
): Promise<Task> => {
  const newTask = { id: Date.now().toString(), text, completed: false };
  if (!tasks[listId]) {
    tasks[listId] = new Set();
  }
  tasks[listId].add(newTask);
  return newTask;
};

export const mockEditTask = async (
  taskId: string,
  listId: string | null,
  updates: Partial<Task>
): Promise<void> => {
  if (!listId || !tasks[listId]) return;

  tasks[listId] = new Set(
    Array.from(tasks[listId]).map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    )
  );
};

export const mockDeleteTask = async (
  taskId: string,
  listId: string
): Promise<{ id: string }> => {
  if (tasks[listId]) {
    tasks[listId] = new Set(
      Array.from(tasks[listId]).filter((t) => t.id !== taskId)
    );
  }
  return { id: taskId };
};

export const mockAddList = async (name: string): Promise<List> => {
  const newList = { id: Date.now().toString(), name };
  mockLists.add(newList);
  tasks[newList.id] = new Set();
  return newList;
};

export const mockEditList = async (
  listId: string,
  name: string
): Promise<List | undefined> => {
  const existingList = Array.from(mockLists).find((list) => list.id === listId);
  if (existingList) {
    mockLists.delete(existingList);
    const updatedList = { ...existingList, name };
    mockLists.add(updatedList);
    return updatedList;
  }
};

export const mockDeleteList = async (
  listId: string
): Promise<{ id: string }> => {
  const existingList = Array.from(mockLists).find((list) => list.id === listId);
  if (existingList) {
    mockLists.delete(existingList);
    delete tasks[listId];
  }
  return { id: listId };
};
