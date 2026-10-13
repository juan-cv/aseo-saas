


import { getCurrentUser } from "@/src/lib/current-user";
import { createServiceType } from "@/src/lib/service-type";
import { db } from "@/src/prisma/db";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "No autenticado" },
      { status: 401 },
    );
  }

  const serviceTypes = await db.orm.public.ServiceType.where({
    tenantId: user.tenantId,
  }).all();

  return Response.json({ serviceTypes });
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
  const rawDescription = body.description;

  if (
    rawDescription !== undefined &&
    rawDescription !== null &&
    typeof rawDescription !== "string"
  ) {
    return Response.json(
      { error: "La descripción debe ser un texto válido" },
      { status: 400 },
    );
  }

  const description =
    typeof rawDescription === "string"
      ? rawDescription.trim() || null
      : null;

  const rawEstimatedMinutes = body.estimatedMinutes;
  let estimatedMinutes: number | null = null;

  if (
    rawEstimatedMinutes !== undefined &&
    rawEstimatedMinutes !== null &&
    rawEstimatedMinutes !== ""
  ) {
    if (
      typeof rawEstimatedMinutes !== "number" &&
      typeof rawEstimatedMinutes !== "string"
    ) {
      return Response.json(
        { error: "La duración debe ser un número entero mayor que cero" },
        { status: 400 },
      );
    }

    const parsedMinutes =
      typeof rawEstimatedMinutes === "string"
        ? Number(rawEstimatedMinutes.trim())
        : rawEstimatedMinutes;

    if (
      !Number.isInteger(parsedMinutes) ||
      parsedMinutes <= 0
    ) {
      return Response.json(
        { error: "La duración debe ser un número entero mayor que cero" },
        { status: 400 },
      );
    }

    estimatedMinutes = parsedMinutes;
  }

  if (!name) {
    return Response.json(
      { error: "El nombre del tipo de servicio es obligatorio" },
      { status: 400 },
    );
  }

  const serviceType = await createServiceType({
    tenantId: user.tenantId,
    name,
    description,
    estimatedMinutes,
  });

  return Response.json(
    { serviceType },
    { status: 201 },
  );
}
