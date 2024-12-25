import { BaseUser } from "../interfaces/entities";
import { IUserRepository } from "../interfaces/userRepository";
import { UsersCache } from "./cache/usersCache";

export class UsersService {
  private repository: IUserRepository;
  private cache: UsersCache;

  constructor(repository: IUserRepository) {
    this.repository = repository;
    this.cache = new UsersCache();
  }

  async getOrCreateUser(
    auth0Id: string,
    email?: string,
    name?: string
  ): Promise<BaseUser> {
    if (!auth0Id) throw new Error("Invalid user ID");

    const cachedUser = await this.cache.getUser(auth0Id);
    if (cachedUser) return cachedUser;

    let user = await this.repository.getUser(auth0Id);
    if (!user) {
      user = await this.repository.createUser(auth0Id, email, name);
    }

    if ((email && email !== user.email) || (name && name !== user.name)) {
      const updated = await this.repository.updateUser(auth0Id, {
        email,
        name,
      });
      if (!updated) throw new Error("Failed to update user");
      return updated;
    }

    await this.cache.setUser(auth0Id, user);
    return user;
  }

  async updatePreferences(
    auth0Id: string,
    preferences: Record<string, unknown>
  ): Promise<BaseUser | null> {
    const user = await this.repository.updatePreferences(auth0Id, preferences);
    if (!user) return null;

    await this.cache.setUser(auth0Id, user);
    return user;
  }
}
