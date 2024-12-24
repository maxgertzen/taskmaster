export const mockGet = jest.fn();
export const mockSet = jest.fn();
export const mockDelete = jest.fn();
export const mockInvalidateCache = jest.fn();

jest.mock("@src/services/cache/cacheService", () => {
  return {
    CacheService: jest.fn().mockImplementation(() => ({
      get: mockGet,
      set: mockSet,
      delete: mockDelete,
      invalidateCache: mockInvalidateCache,
    })),
  };
});
