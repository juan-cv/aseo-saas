import { db } from "@/src/prisma/db";

export async function createLocation(data: {
  tenantId: number;
  customerId: number;
  name: string;
  address: string;
  commune?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  instructions?: string | null;
}) {
  return db.orm.public.Location.create({
    tenantId: data.tenantId,
    customerId: data.customerId,
    name: data.name,
    address: data.address,
    commune: data.commune ?? null,
    contactName: data.contactName ?? null,
    contactPhone: data.contactPhone ?? null,
    instructions: data.instructions ?? null,
  });
}
