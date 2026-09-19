import { db } from "@/src/prisma/db";

export async function createUser(data: {
  tenantId: number;
  email: string;
  passwordHash: string;
  role: "OWNER" | "ADMIN" | "SUPERVISOR" | "WORKER";
}) {
  return db.orm.public.User.create(data);
}
