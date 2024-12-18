import { Filters, Sort } from '../types/mutations';
import { Task } from '../types/shared';

export const filterTasks = (tasks: Task[], filter?: Filters): Task[] => {
  if (!filter) return tasks;

  switch (filter) {
    case 'incomplete':
      return tasks.filter((task) => !task.completed);
    case 'completed':
      return tasks.filter((task) => task.completed);
    default:
      return tasks;
  }
};

export const sortTasks = (tasks: Task[], sort?: Sort): Task[] => {
  if (!sort) return tasks;

  return [...tasks].sort((a, b) => {
    switch (sort) {
      case 'asc':
        return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
      case 'desc':
        return b.text.toLowerCase().localeCompare(a.text.toLowerCase());
      default:
        return 0;
    }
  });
};
