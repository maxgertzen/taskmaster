import { BaseUser } from "../interfaces/entities";
import { IUserRepository } from "../interfaces/userRepository";

export class UserService {
  private repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async getOrCreateUser(
    auth0Id: string,
    email?: string,
    name?: string
  ): Promise<BaseUser> {
    const user = await this.repository.getUser(auth0Id);

    if (!user) {
      return this.repository.createUser(auth0Id, email, name);
    }

    if ((email && email !== user.email) || (name && name !== user.name)) {
      const updated = await this.repository.updateUser(auth0Id, {
        email,
        name,
      });
      if (!updated) throw new Error("Failed to update user");
      return updated;
    }

    return user;
  }

  async updatePreferences(
    auth0Id: string,
    preferences: Record<string, unknown>
  ): Promise<BaseUser | null> {
    return this.repository.updatePreferences(auth0Id, preferences);
  }
}
