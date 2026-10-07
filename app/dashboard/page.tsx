import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/current-user";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main>
      <header>
        <h1>Aseo SaaS</h1>
        <p>Panel de administración</p>
      </header>

      <section>
        <h2>Bienvenido</h2>
        <p>Usuario: {user.email}</p>
        <p>Rol: {user.role}</p>
      </section>

      <nav>
        <h2>Menú principal</h2>

        <ul>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/dashboard/clientes">Clientes</a>
          </li>
          <li>
            <a href="/dashboard/trabajadores">Trabajadores</a>
          </li>
          <li>
            <a href="/dashboard/servicios">Servicios</a>
          </li>
        </ul>
      </nav>

      <form action="/api/auth/logout" method="POST">
        <button type="submit">Cerrar sesión</button>
      </form>
    </main>
  );
}

