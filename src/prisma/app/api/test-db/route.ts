import { db } from "@/src/prisma/db";

export async function GET() {
  return Response.json({ ok: true });
}
