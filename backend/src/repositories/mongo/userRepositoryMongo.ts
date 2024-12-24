import { BaseUser } from "../../interfaces/entities";
import { IUserRepository } from "../../interfaces/userRepository";
import { UserModel } from "../../models/user";
export class UserRepositoryMongo implements IUserRepository {
  async getUser(auth0Id: string): Promise<BaseUser | null> {
    const user = await UserModel.findOne({ auth0Id }).lean();
    return user;
  }

  async createUser(
    auth0Id: string,
    email?: string,
    name?: string
  ): Promise<BaseUser> {
    const user = await UserModel.create({
      auth0Id,
      email,
      name,
      preferences: {},
    });

    return user.toObject();
  }

  async updateUser(
    auth0Id: string,
    updates: Partial<BaseUser>
  ): Promise<BaseUser | null> {
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

  async updatePreferences(
    auth0Id: string,
    preferences: Record<string, unknown>
  ): Promise<BaseUser | null> {
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
}
