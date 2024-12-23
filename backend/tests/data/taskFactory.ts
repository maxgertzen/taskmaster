import { BaseTask, ClientTask } from "@interfaces/entities";

export const taskFactory = {
  generateBaseTask: (overrides: Partial<BaseTask> = {}): BaseTask => ({
    id: "task123",
    creationDate: new Date().toISOString(),
    userId: "user123",
    orderIndex: 0,
    text: "Sample Task",
    completed: false,
    listId: "list123",
    ...overrides,
  }),

  generateMongoTask: (overrides: Partial<BaseTask> = {}): any => ({
    _id: "mocked-mongo-id",
    text: "Sample Task",
    completed: false,
    creationDate: new Date(),
    userId: "mocked-user-id",
    listId: "mocked-list-id",
    orderIndex: 0,
    ...overrides,
  }),

  generateClientTask: (overrides: Partial<ClientTask> = {}): ClientTask => {
    const baseTask = taskFactory.generateBaseTask(overrides);
    return {
      ...baseTask,
      completed: !!baseTask.completed,
    };
  },
};
