import { getUsersService } from "../services";

export async function resolveUserId(
  auth0Id: string,
  email?: string,
  name?: string
): Promise<string> {
  const user = await getUsersService().getOrCreateUser(auth0Id, email, name);

  if (!user) {
    throw new Error(`User with auth0Id ${auth0Id} not found`);
  }

  if ("_id" in user) {
    return user._id?.toString() ?? "";
  }

  return user.auth0Id;
}
