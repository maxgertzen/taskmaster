import { getAppContainer } from "@src/container";
import { DatabaseError } from "@src/errors";

export async function resolveUserId(
  auth0Id: string,
  email?: string,
  name?: string
): Promise<string> {
  const container = getAppContainer();
  const usersService = container.cradle.usersService;
  try {
    const user = await usersService.getOrCreateUser(auth0Id, email, name);

    if (!user) {
      throw new DatabaseError(`User with auth0Id ${auth0Id} not found`);
    }

    return "_id" in user ? user._id?.toString() ?? auth0Id : user.auth0Id;
  } catch (error) {
    throw new DatabaseError("Failed to resolve user ID", {
      auth0Id,
      email,
      name,
    });
  }
}
