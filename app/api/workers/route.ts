import { getCurrentUser } from "@/src/lib/current-user";
import { createWorker } from "@/src/lib/worker";
import { db } from "@/src/prisma/db";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "No autenticado" },
      { status: 401 },
    );
  }

  const workers = await db.orm.public.Worker.where({
    tenantId: user.tenantId,
  }).all();

  return Response.json({ workers });
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

  const name = String(body.name ?? "").trim();
  const rut = String(body.rut ?? "").trim();

  if (!name || !rut) {
    return Response.json(
      { error: "El nombre y el RUT son obligatorios" },
      { status: 400 },
    );
  }

  const worker = await createWorker({
    tenantId: user.tenantId,
    name,
    rut,
    phone: body.phone
      ? String(body.phone).trim()
      : null,
    email: body.email
      ? String(body.email).trim().toLowerCase()
      : null,
    position: body.position
      ? String(body.position).trim()
      : null,
  });

  return Response.json(
    { worker },
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
  const rut = String(body.rut ?? "").trim();

  if (!Number.isInteger(id) || id <= 0) {
    return Response.json(
      { error: "El identificador del trabajador no es válido" },
      { status: 400 },
    );
  }

  if (!name || !rut) {
    return Response.json(
      { error: "El nombre y el RUT son obligatorios" },
      { status: 400 },
    );
  }

  const updatedWorker = await db.orm.public.Worker
    .where({
      id,
      tenantId: user.tenantId,
    })
    .update({
      name,
      rut,
      phone: body.phone
        ? String(body.phone).trim()
        : null,
      email: body.email
        ? String(body.email).trim().toLowerCase()
        : null,
      position: body.position
        ? String(body.position).trim()
        : null,
    });

  if (!updatedWorker) {
    return Response.json(
      { error: "Trabajador no encontrado" },
      { status: 404 },
    );
  }

  return Response.json({
    worker: updatedWorker,
  });
}
