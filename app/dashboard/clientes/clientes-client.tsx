

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

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setEditingId(null);
    setName("");
    setRut("");
    setEmail("");
    setPhone("");
  }

  function handleEdit(customer: Customer) {
    setEditingId(customer.id);
    setName(customer.name);
    setRut(customer.rut ?? "");
    setEmail(customer.email ?? "");
    setPhone(customer.phone ?? "");
    setMessage("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const isEditing = editingId !== null;

    try {
      const response = await fetch("/api/customers", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(isEditing ? { id: editingId } : {}),
          name,
          rut,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ??
            (isEditing
              ? "No se pudieron guardar los cambios."
              : "No se pudo registrar el cliente."),
        );
        return;
      }

      if (isEditing) {
        setCustomers((previous) =>
          previous.map((customer) =>
            customer.id === editingId
              ? data.customer
              : customer,
          ),
        );

        setMessage("Cliente actualizado correctamente.");
      } else {
        setCustomers((previous) => [
          ...previous,
          data.customer,
        ]);

        setMessage("Cliente registrado correctamente.");
      }

      resetForm();
    } catch {
      setMessage("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancelEdit() {
    resetForm();
    setMessage("");
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
        <h2>
          {editingId !== null
            ? "Editar cliente"
            : "Registrar cliente"}
        </h2>

        <form onSubmit={handleSubmit}>
          <p>
            <label htmlFor="name">
              Nombre del cliente *
            </label>
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
            <label htmlFor="email">
              Correo electrónico
            </label>
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
            {loading
              ? "Guardando..."
              : editingId !== null
                ? "Guardar cambios"
                : "Registrar cliente"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </form>

        {message && <p role="status">{message}</p>}
      </section>

      <section>
        <h2>
          Clientes registrados ({customers.length})
        </h2>

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
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.rut ?? "—"}</td>
                  <td>{customer.email ?? "—"}</td>
                  <td>{customer.phone ?? "—"}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(customer)}
                      disabled={loading}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

