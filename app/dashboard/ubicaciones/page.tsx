
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/current-user";
import { db } from "@/src/prisma/db";
import UbicacionesClient from "./ubicaciones-client";

export default async function UbicacionesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const [customers, locations] = await Promise.all([
    db.orm.public.Customer.where({
      tenantId: user.tenantId,
    }).all(),

    db.orm.public.Location.where({
      tenantId: user.tenantId,
    }).all(),
  ]);

  return (
    <UbicacionesClient
      initialCustomers={customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
      }))}
      initialLocations={locations.map((location) => ({
        id: location.id,
        customerId: location.customerId,
        name: location.name,
        address: location.address,
        commune: location.commune,
        contactName: location.contactName,
        contactPhone: location.contactPhone,
        instructions: location.instructions,
        active: location.active,
      }))}
    />
  );
}
