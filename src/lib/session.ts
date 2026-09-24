import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "";

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET no está configurado");
}

export function createSessionToken(userId: number, tenantId: number) {
  const payload = `${userId}.${tenantId}`;

  const signature = createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [userId, tenantId, signature] = parts;
  const payload = `${userId}.${tenantId}`;

  const expectedSignature = createHmac("sha256", SESSION_SECRET)
  .update(payload)
  .digest("hex");
  

  const received = Buffer.from(signature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (received.length !== expected.length) {
    return null;
  }

  if (!timingSafeEqual(received, expected)) {
    return null;
  }

  const parsedUserId = Number(userId);
  const parsedTenantId = Number(tenantId);

  if (
    !Number.isInteger(parsedUserId) ||
    !Number.isInteger(parsedTenantId)
  ) {
    return null;
  }

  return {
    userId: parsedUserId,
    tenantId: parsedTenantId,
  };
}

