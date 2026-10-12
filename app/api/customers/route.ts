import { getCurrentUser } from "@/src/lib/current-user";
import { createCustomer } from "@/src/lib/customer";
import { db } from "@/src/prisma/db";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "No autenticado" },
      { status: 401 },
    );
  }

  const customers = await db.orm.public.Customer.where({
    tenantId: user.tenantId,
  }).all();

  return Response.json({
    customers,
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "No autenticado" },
      { status: 401 },
    );
  }

  const body = await request.json();

  const name = String(body.name ?? "").trim();

  if (!name) {
    return Response.json(
      { error: "El nombre del cliente es obligatorio" },
      { status: 400 },
    );
  }

  const customer = await createCustomer({
    tenantId: user.tenantId,
    name,
    rut: body.rut ? String(body.rut).trim() : null,
    email: body.email ? String(body.email).trim().toLowerCase() : null,
    phone: body.phone ? String(body.phone).trim() : null,
  });

  return Response.json(
    { customer },
    { status: 201 },
  );
}
