import { hash } from "bcryptjs";
import { db } from "@/src/prisma/db";

export async function createUser(data: {
  tenantId: number;
  email: string;
  password: string;
  role: "OWNER" | "ADMIN" | "SUPERVISOR" | "WORKER";
}) {
  const passwordHash = await hash(data.password, 12);

  return db.orm.public.User.create({
    tenantId: data.tenantId,
    email: data.email,
    passwordHash,
    role: data.role,
  });
}
