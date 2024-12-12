import { BaseUser } from "./entities";

export interface IUserRepository {
  getUser(auth0Id: string): Promise<BaseUser | null>;
  createUser(auth0Id: string, email?: string, name?: string): Promise<BaseUser>;
  updateUser(
    auth0Id: string,
    updates: Partial<BaseUser>
  ): Promise<BaseUser | null>;
  updatePreferences(
    auth0Id: string,
    preferences: Record<string, unknown>
  ): Promise<BaseUser | null>;
}
