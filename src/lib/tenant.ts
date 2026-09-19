import { db } from "@/src/prisma/db";

export async function createTenant(data: {
  name: string;
  rut: string;
  email: string;
  phone?: string;
  logoUrl?: string;
}) {
  return db.orm.public.Tenant.create(data);
}

