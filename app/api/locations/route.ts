
import { getCurrentUser } from "@/src/lib/current-user";
import { createLocation } from "@/src/lib/location";
import { db } from "@/src/prisma/db";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "No autenticado" },
      { status: 401 },
    );
  }

  const locations = await db.orm.public.Location.where({
    tenantId: user.tenantId,
  }).all();

  return Response.json({ locations });
}

export async function POST(request: Request) {
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

  const customerId = Number(body.customerId);
  const name = String(body.name ?? "").trim();
  const address = String(body.address ?? "").trim();

  if (
    !Number.isInteger(customerId) ||
    customerId <= 0
  ) {
    return Response.json(
      { error: "Debes seleccionar un cliente válido" },
      { status: 400 },
    );
  }

  if (!name || !address) {
    return Response.json(
      { error: "El nombre y la dirección son obligatorios" },
      { status: 400 },
    );
  }

  const customers = await db.orm.public.Customer
    .where({
      id: customerId,
      tenantId: user.tenantId,
    })
    .all();

  if (customers.length === 0) {
    return Response.json(
      { error: "El cliente no existe en tu empresa" },
      { status: 404 },
    );
  }

  const location = await createLocation({
    tenantId: user.tenantId,
    customerId,
    name,
    address,
    commune: body.commune
      ? String(body.commune).trim()
      : null,
    contactName: body.contactName
      ? String(body.contactName).trim()
      : null,
    contactPhone: body.contactPhone
      ? String(body.contactPhone).trim()
      : null,
    instructions: body.instructions
      ? String(body.instructions).trim()
      : null,
  });

  return Response.json(
    { location },
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
  const customerId = Number(body.customerId);
  const name = String(body.name ?? "").trim();
  const address = String(body.address ?? "").trim();

  if (!Number.isInteger(id) || id <= 0) {
    return Response.json(
      { error: "El identificador de la ubicación no es válido" },
      { status: 400 },
    );
  }

  if (!Number.isInteger(customerId) || customerId <= 0) {
    return Response.json(
      { error: "Debes seleccionar un cliente válido" },
      { status: 400 },
    );
  }

  if (!name || !address) {
    return Response.json(
      { error: "El nombre y la dirección son obligatorios" },
      { status: 400 },
    );
  }

  const customers = await db.orm.public.Customer
    .where({
      id: customerId,
      tenantId: user.tenantId,
    })
    .all();

  if (customers.length === 0) {
    return Response.json(
      { error: "El cliente no existe en tu empresa" },
      { status: 404 },
    );
  }

  const updatedLocation = await db.orm.public.Location
    .where({
      id,
      tenantId: user.tenantId,
    })
    .update({
      customerId,
      name,
      address,
      commune: body.commune
        ? String(body.commune).trim()
        : null,
      contactName: body.contactName
        ? String(body.contactName).trim()
        : null,
      contactPhone: body.contactPhone
        ? String(body.contactPhone).trim()
        : null,
      instructions: body.instructions
        ? String(body.instructions).trim()
        : null,
    });

  if (!updatedLocation) {
    return Response.json(
      { error: "Ubicación no encontrada" },
      { status: 404 },
    );
  }

  return Response.json({
    location: updatedLocation,
  });
}