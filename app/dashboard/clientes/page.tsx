

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/current-user";
import { db } from "@/src/prisma/db";
import ClientesClient from "./clientes-client";

export default async function ClientesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const customers = await db.orm.public.Customer.where({
    tenantId: user.tenantId,
  }).all();

  return (
    <ClientesClient initialCustomers={customers} />
  );
}

