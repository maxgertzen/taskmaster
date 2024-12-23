import { CACHE_KEYS } from "@src/utils/cacheKeys";
import { testConfig } from "../../data/utils";
import { CacheKey } from "@tests/types/utils";
import { generateExpectedKey } from "@tests/helpers/cacheKeys";

describe("CACHE_KEYS", () => {
  const cacheKeys = Object.keys(CACHE_KEYS) as CacheKey[];
  const { validInputs, edgeCases } = testConfig;

  describe("valid inputs", () => {
    const keyToArgs: Record<CacheKey, string[]> = {
      TASK: [validInputs.userId, validInputs.taskId],
      TASK_LIST: [validInputs.userId, validInputs.listId],
      LIST: [validInputs.userId, validInputs.listId],
      LISTS: [validInputs.userId],
      SEARCH_RESULTS: [validInputs.userId, validInputs.query],
      USER: [validInputs.auth0Id],
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
      const result = CACHE_KEYS.TASK(
        edgeCases.emptyStrings.userId,
        validInputs.taskId
      );
      const expected = generateExpectedKey("TASK", [
        edgeCases.emptyStrings.userId,
        validInputs.taskId,
      ]);
      expect(result).toBe(expected);
    });

    it("should handle special characters", () => {
      const { userId, listId } = edgeCases.specialChars;
      const result = CACHE_KEYS.TASK_LIST(userId, listId);
      const expected = generateExpectedKey("TASK_LIST", [userId, listId]);
      expect(result).toBe(expected);
    });
  });

  it("should match the expected structure snapshot", () => {
    expect(CACHE_KEYS).toMatchSnapshot();
  });
});
