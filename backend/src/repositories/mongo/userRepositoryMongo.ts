import { DatabaseError, NotFoundError } from "@src/errors";
import { BaseUser } from "../../interfaces/entities";
import { IUserRepository } from "../../interfaces/userRepository";
import { UserModel } from "../../models/user";
export class UserRepositoryMongo implements IUserRepository {
  async getUser(auth0Id: string): Promise<BaseUser | null> {
    try {
      const user = await UserModel.findOne({ auth0Id }).lean();

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      throw new DatabaseError(
        "Failed to get user",
        {
          auth0Id,
        },
        error as Error
      );
    }
  }

  async createUser(
    auth0Id: string,
    email?: string,
    name?: string
  ): Promise<BaseUser> {
    try {
      const user = await UserModel.create({
        auth0Id,
        email,
        name,
        preferences: {},
      });

      return user.toObject();
    } catch (error) {
      throw new DatabaseError(
        "Failed to create user",
        {
          auth0Id,
          email,
          name,
        },
        error as Error
      );
    }
  }

  async updateUser(
    auth0Id: string,
    updates: Partial<BaseUser>
  ): Promise<BaseUser | null> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { auth0Id },
        { $set: updates },
        { new: true }
      ).lean();

      if (!updatedUser) {
        throw new NotFoundError(`User with ID ${auth0Id} not found`);
      }

      return updatedUser;
    } catch (error) {
      throw new DatabaseError(
        "Failed to update user",
        {
          auth0Id,
          updates,
        },
        error as Error
      );
    }
  }

  async updatePreferences(
    auth0Id: string,
    preferences: Record<string, unknown>
  ): Promise<BaseUser | null> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { auth0Id },
        { $set: { preferences } },
        { new: true }
      ).lean();

      if (!updatedUser) {
        throw new NotFoundError(`User with ID ${auth0Id} not found`);
      }

      return updatedUser;
    } catch (error) {
      throw new DatabaseError(
        "Failed to update user preferences",
        {
          auth0Id,
          preferences,
        },
        error as Error
      );
    }
  }
}
