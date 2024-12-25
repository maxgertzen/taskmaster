import { BaseUser } from "@src/interfaces/entities";
import { IUserRepository } from "../../interfaces/userRepository";
import { REDIS_KEYS } from "../../utils/redisKeys";
import { RedisClientType } from "redis";

export class UserRepositoryRedis implements IUserRepository {
  constructor(private readonly redisClient: RedisClientType) {}

  async getUser(auth0Id: string): Promise<BaseUser | null> {
    const userKey = REDIS_KEYS.USER(auth0Id);
    const userData = await this.redisClient.hGetAll(userKey);

    if (!userData.auth0Id) return null;

    return {
      auth0Id: userData.auth0Id,
      email: userData.email,
      name: userData.name,
      preferences: userData.preferences ? JSON.parse(userData.preferences) : {},
    } as BaseUser;
  }

  async createUser(
    auth0Id: string,
    email?: string,
    name?: string
  ): Promise<BaseUser> {
    const userKey = REDIS_KEYS.USER(auth0Id);
    const defaultPreferences = {};

    const userData = {
      auth0Id,
      email: email || "",
      name: name || "",
      preferences: JSON.stringify(defaultPreferences),
    };

    await this.redisClient.hSet(userKey, userData);

    return {
      ...userData,
      preferences: defaultPreferences,
    } as BaseUser;
  }

  async updateUser(
    auth0Id: string,
    updates: Partial<BaseUser>
  ): Promise<BaseUser | null> {
    const userKey = REDIS_KEYS.USER(auth0Id);
    const exists = await this.redisClient.exists(userKey);
    if (!exists) return null;

    const updateData: Record<string, string> = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (key === "preferences") {
        updateData[key] = JSON.stringify(value);
      } else {
        updateData[key] = String(value);
      }
    });

    await this.redisClient.hSet(userKey, updateData);
    return this.getUser(auth0Id);
  }

  async updatePreferences(
    auth0Id: string,
    preferences: Record<string, unknown>
  ): Promise<BaseUser | null> {
    return this.updateUser(auth0Id, { preferences });
  }
}
