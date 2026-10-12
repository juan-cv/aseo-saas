
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
    email: body.email
      ? String(body.email).trim().toLowerCase()
      : null,
    phone: body.phone ? String(body.phone).trim() : null,
  });

  return Response.json(
    { customer },
    { status: 201 },
  );
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "No autenticado" },
      { status: 401 },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "El cuerpo de la solicitud no es válido" },
      { status: 400 },
    );
  }

  const id = Number(body.id);
  const name = String(body.name ?? "").trim();

  if (!Number.isInteger(id) || id <= 0) {
    return Response.json(
      { error: "El identificador del cliente no es válido" },
      { status: 400 },
    );
  }

  if (!name) {
    return Response.json(
      { error: "El nombre del cliente es obligatorio" },
      { status: 400 },
    );
  }

  const updatedCustomer = await db.orm.public.Customer
    .where({
      id,
      tenantId: user.tenantId,
    })
    .update({
      name,
      rut: body.rut ? String(body.rut).trim() : null,
      email: body.email
        ? String(body.email).trim().toLowerCase()
        : null,
      phone: body.phone ? String(body.phone).trim() : null,
    });

  if (!updatedCustomer) {
    return Response.json(
      { error: "Cliente no encontrado" },
      { status: 404 },
    );
  }

  return Response.json({
    customer: updatedCustomer,
  });
}



