import { RedisClientType } from "redis";

export const mockRedisClient = {
  hGetAll: jest.fn(),
  hSet: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  expire: jest.fn(),
  connect: jest.fn(),
  on: jest.fn(),
  isOpen: false,
  isReady: false,
  disconnect: jest.fn(),
  quit: jest.fn(),
  commandOptions: jest.fn(),
} as unknown as RedisClientType;
