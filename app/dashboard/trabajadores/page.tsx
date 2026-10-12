import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/current-user";
import { db } from "@/src/prisma/db";
import TrabajadoresClient from "./trabajadores-client";

export default async function TrabajadoresPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const workers = await db.orm.public.Worker.where({
    tenantId: user.tenantId,
  }).all();

  return <TrabajadoresClient initialWorkers={workers} />;
}
