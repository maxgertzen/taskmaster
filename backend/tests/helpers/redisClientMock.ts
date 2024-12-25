export const mockRedisClient = {
  hGetAll: jest.fn(),
  hSet: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  expire: jest.fn(),
  connect: jest.fn(),
  on: jest.fn(),
};
