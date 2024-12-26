import { taskFactory } from "@tests/data";
import { setupServiceTest } from "@tests/helpers/serviceTestUtils";
import { ServiceTestContext } from "@tests/types/serviceTypes";

describe("TasksService", () => {
  let testContext: ServiceTestContext<"tasks">;

  beforeEach(() => {
    testContext = setupServiceTest("tasks");
  });

  afterEach(() => {
    testContext.container.dispose();
  });

  it("should create a new task and invalidate cache", async () => {
    const mockTask = taskFactory.generateClientTask();
    testContext.repository.createTask.mockResolvedValue(mockTask);

    const result = await testContext.service.createTask(
      mockTask.userId,
      mockTask.listId,
      mockTask.text
    );
    expect(result).toEqual(mockTask);
    expect(testContext.repository.createTask).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.listId,
      mockTask.text
    );

    expect(testContext.cache.invalidateTasks).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.listId
    );
  });

  it("should retrieve tasks for a user and list", async () => {
    const mockTask = taskFactory.generateClientTask();
    const mockTasks = [
      mockTask,
      taskFactory.generateClientTask({ listId: mockTask.listId }),
    ];

    testContext.repository.getTasks.mockResolvedValue(mockTasks);

    const result = await testContext.service.getTasks(
      mockTask.userId,
      mockTask.listId
    );
    expect(result).toEqual(mockTasks);
    expect(testContext.repository.getTasks).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.listId
    );
  });

  it("should retrieve search results for tasks", async () => {
    const mockTask = taskFactory.generateClientTask();
    const mockSearchResults = [
      {
        listName: "My List",
        tasks: [
          mockTask,
          taskFactory.generateClientTask({ userId: mockTask.userId }),
        ],
      },
    ];

    testContext.repository.getTasksSearchResults.mockResolvedValue(
      mockSearchResults
    );

    const result = await testContext.service.getTasksSearchResults(
      mockTask.userId,
      "search"
    );
    expect(result).toEqual(mockSearchResults);
    expect(testContext.repository.getTasksSearchResults).toHaveBeenCalledWith(
      mockTask.userId,
      "search"
    );
  });

  it("should update a task", async () => {
    const mockTask = taskFactory.generateClientTask();
    const updates = { text: "Updated Task Text" };

    testContext.repository.updateTask.mockResolvedValue(mockTask.id);

    const result = await testContext.service.updateTask(
      mockTask.userId,
      mockTask.id,
      updates
    );
    expect(result).toBe(mockTask.id);
    expect(testContext.repository.updateTask).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.id,
      updates
    );
  });

  it("should delete a task", async () => {
    const mockTask = taskFactory.generateClientTask();

    testContext.repository.deleteTask.mockResolvedValue(mockTask.id);

    const result = await testContext.service.deleteTask(
      mockTask.userId,
      mockTask.id,
      mockTask.listId
    );
    expect(result).toBe(mockTask.id);
    expect(testContext.repository.deleteTask).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.id,
      mockTask.listId
    );
  });

  it("should reorder tasks", async () => {
    const mockTask = taskFactory.generateClientTask();
    const orderedIds = ["task1", "task2", "task3"];
    const reorderedTasks = orderedIds.map((id, index) =>
      taskFactory.generateClientTask({
        id,
        userId: mockTask.userId,
        listId: mockTask.listId,
        orderIndex: index,
      })
    );

    testContext.repository.reorderTasks.mockResolvedValue(reorderedTasks);

    const result = await testContext.service.reorderTasks(
      mockTask.userId,
      mockTask.listId,
      orderedIds
    );
    expect(result).toEqual(reorderedTasks);
    expect(testContext.repository.reorderTasks).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.listId,
      orderedIds
    );
  });

  it("should toggle complete state for all tasks", async () => {
    const mockTask = taskFactory.generateClientTask();
    const newCompletedState = true;
    const mockTasks = [
      taskFactory.generateClientTask({ completed: true }),
      taskFactory.generateClientTask({ completed: true }),
    ];

    testContext.repository.toggleCompleteAll.mockResolvedValue(mockTasks);

    const result = await testContext.service.toggleCompleteAll(
      mockTask.userId,
      mockTask.listId,
      newCompletedState
    );
    expect(result).toEqual(mockTasks);
    expect(testContext.repository.toggleCompleteAll).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.listId,
      newCompletedState
    );
  });

  it("should bulk delete tasks", async () => {
    const mockTask = taskFactory.generateClientTask();
    const mode = "completed";
    const mockTasks = [
      taskFactory.generateClientTask({ completed: true }),
      taskFactory.generateClientTask({ completed: true }),
    ];

    testContext.repository.bulkDelete.mockResolvedValue(mockTasks);

    const result = await testContext.service.bulkDelete(
      mockTask.userId,
      mockTask.listId,
      mode
    );
    expect(result).toEqual(mockTasks);
    expect(testContext.repository.bulkDelete).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.listId,
      mode
    );
  });
});
