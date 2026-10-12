
import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Inicio", icon: "⌂" },
  { href: "/dashboard/clientes", label: "Clientes", icon: "♧" },
  { href: "/dashboard/ubicaciones", label: "Ubicaciones", icon: "⌖" },
  { href: "/dashboard/trabajadores", label: "Trabajadores", icon: "♙" },
  { href: "/dashboard/servicios", label: "Servicios", icon: "✓" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f5f8f6] lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[#e1e9e3] bg-white p-5 lg:flex">
        <Link
          href="/dashboard"
          className="mb-10 flex items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-xl font-bold text-white">
            A
          </span>
          <span>
            <span className="block text-lg font-bold text-slate-900">
              Aseo SaaS
            </span>
            <span className="block text-xs text-slate-500">
              Gestión de servicios
            </span>
          </span>
        </Link>

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menú principal
        </p>

        <nav className="flex flex-col gap-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-12 items-center gap-3 rounded-xl px-3 font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800"
            >
              <span className="w-6 text-center text-xl" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-0">
        {children}
      </div>

      <nav
        aria-label="Navegación móvil"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-slate-200 bg-white px-1 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] lg:hidden"
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <span className="text-xl" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
