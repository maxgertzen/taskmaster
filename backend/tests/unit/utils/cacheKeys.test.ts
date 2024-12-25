import { CACHE_KEYS } from "@src/utils/cacheKeys";
import { CacheKey } from "@tests/types/utils";
import { generateExpectedKey } from "@tests/helpers/cacheKeys";
import { listFactory, taskFactory, userFactory } from "@tests/data";

describe("CACHE_KEYS", () => {
  const user = userFactory.generateBaseUser();
  const list = listFactory.generateBaseList();
  const task = taskFactory.generateBaseTask();

  const cacheKeys = Object.keys(CACHE_KEYS) as CacheKey[];

  describe("valid inputs", () => {
    const keyToArgs: Record<CacheKey, string[]> = {
      TASK: [task.userId, task.id],
      TASK_LIST: [list.userId, list.id],
      LIST: [list.userId, list.id],
      LISTS: [list.userId],
      SEARCH_RESULTS: [user.auth0Id, "query"],
      USER: [user.auth0Id],
    };

    cacheKeys.forEach((key) => {
      it(`should generate correct cache key for ${key}`, () => {
        const args = keyToArgs[key];
        const fn = CACHE_KEYS[key];
        const expected = generateExpectedKey(key, args);

        expect(fn(...(args as [string, string]))).toBe(expected);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty userId", () => {
      const result = CACHE_KEYS.TASK("", task.id);
      const expected = generateExpectedKey("TASK", ["", task.id]);
      expect(result).toBe(expected);
    });
  });
});
