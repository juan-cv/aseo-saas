import { db } from "@/src/prisma/db";

export async function createServiceType(data: {
  tenantId: number;
  name: string;
  description?: string | null;
  estimatedMinutes?: number | null;
}) {
  return db.orm.public.ServiceType.create({
    tenantId: data.tenantId,
    name: data.name,
    description: data.description ?? null,
    estimatedMinutes: data.estimatedMinutes ?? null,
    active: true,
  });
}
