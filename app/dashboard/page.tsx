import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/current-user";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Panel principal de Aseo SaaS.</p>
      <p>Usuario: {user.email}</p>
      <p>Rol: {user.role}</p>
    </main>
  );
}

