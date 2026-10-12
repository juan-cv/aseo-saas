import { db } from "@/src/prisma/db";

export async function createWorker(data: {
  tenantId: number;
  name: string;
  rut: string;
  phone?: string | null;
  email?: string | null;
  position?: string | null;
}) {
  return db.orm.public.Worker.create({
    tenantId: data.tenantId,
    name: data.name,
    rut: data.rut,
    phone: data.phone ?? null,
    email: data.email ?? null,
    position: data.position ?? null,
    active: true,
  });
}