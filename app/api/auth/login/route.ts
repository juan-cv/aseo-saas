import {
  findUserByEmail,
  verifyUserPassword,
} from "@/src/lib/user";
import { setSessionCookie } from "@/src/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();

  const tenantId = Number(body.tenantId);
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!Number.isInteger(tenantId) || !email || !password) {
    return Response.json(
      { error: "Datos de login incompletos" },
      { status: 400 },
    );
  }

  const user = await findUserByEmail(tenantId, email);

  if (!user || !user.active) {
    return Response.json(
      { error: "Credenciales inválidas" },
      { status: 401 },
    );
  }

  const validPassword = await verifyUserPassword(
    password,
    user.passwordHash,
  );

  if (!validPassword) {
    return Response.json(
      { error: "Credenciales inválidas" },
      { status: 401 },
    );
  }

  await setSessionCookie(user.id, user.tenantId);

  return Response.json({
    authenticated: true,
    user: {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    },
  });
}
