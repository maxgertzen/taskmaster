import { ITaskRepository } from "@interfaces/taskRepository";
import { TasksService } from "@src/services/tasksService";
import { taskFactory } from "@tests/data";

describe("TasksService", () => {
  let taskService: TasksService;
  let mockTaskRepository: jest.Mocked<ITaskRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      createTask: jest.fn(),
      getTasks: jest.fn(),
      getTasksSearchResults: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      reorderTasks: jest.fn(),
      toggleCompleteAll: jest.fn(),
      bulkDelete: jest.fn(),
    };
    taskService = new TasksService(mockTaskRepository);
  });

  it("should create a new task", async () => {
    const mockTask = taskFactory.generateClientTask();
    mockTaskRepository.createTask.mockResolvedValue(mockTask);

    const result = await taskService.createTask(
      mockTask.userId,
      mockTask.listId,
      mockTask.text
    );
    expect(result).toEqual(mockTask);
    expect(mockTaskRepository.createTask).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.listId,
      mockTask.text
    );
  });

  it("should retrieve tasks for a user and list", async () => {
    const mockTask = taskFactory.generateClientTask();
    const mockTasks = [
      mockTask,
      taskFactory.generateClientTask({ listId: mockTask.listId }),
    ];

    mockTaskRepository.getTasks.mockResolvedValue(mockTasks);

    const result = await taskService.getTasks(mockTask.userId, mockTask.listId);
    expect(result).toEqual(mockTasks);
    expect(mockTaskRepository.getTasks).toHaveBeenCalledWith(
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

    mockTaskRepository.getTasksSearchResults.mockResolvedValue(
      mockSearchResults
    );

    const result = await taskService.getTasksSearchResults(
      mockTask.userId,
      "search"
    );
    expect(result).toEqual(mockSearchResults);
    expect(mockTaskRepository.getTasksSearchResults).toHaveBeenCalledWith(
      mockTask.userId,
      "search"
    );
  });

  it("should update a task", async () => {
    const mockTask = taskFactory.generateClientTask();
    const updates = { text: "Updated Task Text" };

    mockTaskRepository.updateTask.mockResolvedValue(mockTask.id);

    const result = await taskService.updateTask(
      mockTask.userId,
      mockTask.id,
      updates
    );
    expect(result).toBe(mockTask.id);
    expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.id,
      updates
    );
  });

  it("should delete a task", async () => {
    const mockTask = taskFactory.generateClientTask();

    mockTaskRepository.deleteTask.mockResolvedValue(mockTask.id);

    const result = await taskService.deleteTask(
      mockTask.userId,
      mockTask.id,
      mockTask.listId
    );
    expect(result).toBe(mockTask.id);
    expect(mockTaskRepository.deleteTask).toHaveBeenCalledWith(
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

    mockTaskRepository.reorderTasks.mockResolvedValue(reorderedTasks);

    const result = await taskService.reorderTasks(
      mockTask.userId,
      mockTask.listId,
      orderedIds
    );
    expect(result).toEqual(reorderedTasks);
    expect(mockTaskRepository.reorderTasks).toHaveBeenCalledWith(
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

    mockTaskRepository.toggleCompleteAll.mockResolvedValue(mockTasks);

    const result = await taskService.toggleCompleteAll(
      mockTask.userId,
      mockTask.listId,
      newCompletedState
    );
    expect(result).toEqual(mockTasks);
    expect(mockTaskRepository.toggleCompleteAll).toHaveBeenCalledWith(
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

    mockTaskRepository.bulkDelete.mockResolvedValue(mockTasks);

    const result = await taskService.bulkDelete(
      mockTask.userId,
      mockTask.listId,
      mode
    );
    expect(result).toEqual(mockTasks);
    expect(mockTaskRepository.bulkDelete).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.listId,
      mode
    );
  });
});
