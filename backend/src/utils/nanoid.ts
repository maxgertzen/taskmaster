export async function generateUniqueId() {
  const { nanoid } = await import("nanoid");
  return nanoid();
}
