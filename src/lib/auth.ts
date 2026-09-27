import { cookies } from "next/headers";
import {
  createSessionToken,
  verifySessionToken,
} from "@/src/lib/session";

const SESSION_COOKIE = "aseo_session";

export async function setSessionCookie(
  userId: number,
  tenantId: number,
) {
  const cookieStore = await cookies();
  const token = createSessionToken(userId, tenantId);

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function clearSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);
}
