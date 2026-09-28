import { getSession } from "@/src/lib/auth";
import { findUserById } from "@/src/lib/user";

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await findUserById(
    session.userId,
    session.tenantId,
  );

  if (!user || !user.active) {
    return null;
  }

  return user;
}
