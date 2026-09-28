import { clearSession } from "@/src/lib/auth";

export async function POST() {
  await clearSession();

  return Response.json({
    authenticated: false,
  });
}

