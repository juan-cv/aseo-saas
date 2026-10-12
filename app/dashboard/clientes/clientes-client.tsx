
"use client";

import { useState } from "react";

type Customer = {
  id: number;
  name: string;
  rut: string | null;
  email: string | null;
  phone: string | null;
};

type Props = {
  initialCustomers: Customer[];
};

export default function ClientesClient({
  initialCustomers,
}: Props) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          rut,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "No se pudo registrar el cliente.");
        return;
      }

      setCustomers((previous) => [...previous, data.customer]);
      setName("");
      setRut("");
      setEmail("");
      setPhone("");
      setMessage("Cliente registrado correctamente.");
    } catch {
      setMessage("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header>
        <h1>Gestión de clientes</h1>
        <p>Administra los clientes de tu empresa.</p>
      </header>

      <p>
        <a href="/dashboard">← Volver al dashboard</a>
      </p>

      <section>
        <h2>Registrar cliente</h2>

        <form onSubmit={handleSubmit}>
          <p>
            <label htmlFor="name">Nombre del cliente *</label>
            <br />
            <input
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </p>

          <p>
            <label htmlFor="rut">RUT</label>
            <br />
            <input
              id="rut"
              name="rut"
              value={rut}
              onChange={(event) => setRut(event.target.value)}
            />
          </p>

          <p>
            <label htmlFor="email">Correo electrónico</label>
            <br />
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </p>

          <p>
            <label htmlFor="phone">Teléfono</label>
            <br />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </p>

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar cliente"}
          </button>
        </form>

        {message && <p role="status">{message}</p>}
      </section>

      <section>
        <h2>Clientes registrados ({customers.length})</h2>

        {customers.length === 0 ? (
          <p>Aún no hay clientes registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>RUT</th>
                <th>Correo</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.rut ?? "—"}</td>
                  <td>{customer.email ?? "—"}</td>
                  <td>{customer.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
