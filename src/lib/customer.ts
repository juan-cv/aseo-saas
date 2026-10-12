import { db } from "@/src/prisma/db";

export async function createCustomer(data: {
  tenantId: number;
  name: string;
  rut?: string | null;
  email?: string | null;
  phone?: string | null;
}) {
  return db.orm.public.Customer.create({
    tenantId: data.tenantId,
    name: data.name,
    rut: data.rut ?? null,
    email: data.email ?? null,
    phone: data.phone ?? null,
  });
}
