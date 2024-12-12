import { BaseUser } from "../../interfaces/entities";
import { IUserRepository } from "../../interfaces/userRepository";
import { UserModel } from "../../models/user";

import {
  withCache,
  withCacheInvalidation,
} from "../../services/cache/cacheWrapper";
import { CACHE_KEYS } from "../../utils/cacheKeys";

export class UserRepositoryMongo implements IUserRepository {
  private readonly getUserWithCache = withCache(
    async (auth0Id: string): Promise<BaseUser | null> => {
      const user = await UserModel.findOne({ auth0Id }).lean();
      return user;
    },
    {
      type: "USER",
      keyGenerator: (auth0Id) => CACHE_KEYS.USER(auth0Id),
    }
  );

  private readonly createUserWithCache = withCacheInvalidation(
    async (
      auth0Id: string,
      email?: string,
      name?: string
    ): Promise<BaseUser> => {
      const user = await UserModel.create({
        auth0Id,
        email,
        name,
        preferences: {},
      });

      return user.toObject();
    }
  );

  private readonly updateUserWithCache = withCacheInvalidation(
    async (
      auth0Id: string,
      updates: Partial<BaseUser>
    ): Promise<BaseUser | null> => {
      const updatedUser = await UserModel.findOneAndUpdate(
        { auth0Id },
        { $set: updates },
        { new: true }
      ).lean();

      if (!updatedUser) {
        throw new Error(`User with ID ${auth0Id} not found`);
      }

      return updatedUser;
    }
  );

  private readonly updatePreferencesWithCache = withCacheInvalidation(
    async (
      auth0Id: string,
      preferences: Record<string, unknown>
    ): Promise<BaseUser | null> => {
      const updatedUser = await UserModel.findOneAndUpdate(
        { auth0Id },
        { $set: { preferences } },
        { new: true }
      ).lean();

      if (!updatedUser) {
        throw new Error(`User with ID ${auth0Id} not found`);
      }

      return updatedUser;
    }
  );

  async getUser(auth0Id: string): Promise<BaseUser | null> {
    return this.getUserWithCache(auth0Id);
  }

  async createUser(
    auth0Id: string,
    email?: string,
    name?: string
  ): Promise<BaseUser> {
    return this.createUserWithCache(auth0Id, email, name);
  }

  async updateUser(
    auth0Id: string,
    updates: Partial<BaseUser>
  ): Promise<BaseUser | null> {
    return this.updateUserWithCache(auth0Id, updates);
  }

  async updatePreferences(
    auth0Id: string,
    preferences: Record<string, unknown>
  ): Promise<BaseUser | null> {
    return this.updatePreferencesWithCache(auth0Id, preferences);
  }
}
