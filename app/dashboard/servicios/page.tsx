
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/current-user";
import { db } from "@/src/prisma/db";
import ServiciosClient from "./servicios-client";

export default async function ServiciosPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const serviceTypes = await db.orm.public.ServiceType.where({
    tenantId: user.tenantId,
  }).all();

  return (
    <ServiciosClient
      initialServiceTypes={serviceTypes.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        estimatedMinutes: service.estimatedMinutes,
        active: service.active,
      }))}
    />
  );
}

