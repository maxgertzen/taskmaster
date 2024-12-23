import { REDIS_KEYS } from "@src/utils/redisKeys";
import { testConfig } from "@tests/data/utils";

const { validInputs, edgeCases } = testConfig;

describe("REDIS_KEYS", () => {
  describe("USER key", () => {
    it("should generate correct user key", () => {
      const result = REDIS_KEYS.USER(validInputs.userId);
      expect(result).toBe(`user:${validInputs.userId}`);
    });

    it("should handle empty userId", () => {
      const result = REDIS_KEYS.USER(edgeCases.emptyStrings.userId);
      expect(result).toBe("user:");
    });
  });

  describe("TASK key", () => {
    it("should generate correct task key", () => {
      const result = REDIS_KEYS.TASK(validInputs.userId, validInputs.taskId);
      expect(result).toBe(
        `user:${validInputs.userId}:task:${validInputs.taskId}`
      );
    });

    it("should handle special characters", () => {
      const { userId, taskId } = edgeCases.specialChars;
      const result = REDIS_KEYS.TASK(userId, taskId);
      expect(result).toBe(`user:${userId}:task:${taskId}`);
    });
  });

  describe("TASK_LIST key", () => {
    it("should generate correct task list key", () => {
      const result = REDIS_KEYS.TASK_LIST(
        validInputs.userId,
        validInputs.listId
      );
      expect(result).toBe(
        `user:${validInputs.userId}:tasks:${validInputs.listId}`
      );
    });
  });

  describe("LIST key", () => {
    it("should generate correct list key", () => {
      const result = REDIS_KEYS.LIST(validInputs.userId, validInputs.listId);
      expect(result).toBe(
        `user:${validInputs.userId}:list:${validInputs.listId}`
      );
    });
  });

  describe("LISTS key", () => {
    it("should generate correct lists key", () => {
      const result = REDIS_KEYS.LISTS(validInputs.userId);
      expect(result).toBe(`user:${validInputs.userId}:lists`);
    });
  });

  describe("TASKS_INDEX", () => {
    it("should return correct tasks index key", () => {
      expect(REDIS_KEYS.TASKS_INDEX).toBe("tasks_index");
    });
  });

  it("should match snapshot", () => {
    expect(REDIS_KEYS).toMatchSnapshot();
  });
});
