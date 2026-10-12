"use client";

import { useState } from "react";

type Worker = {
  id: number;
  name: string;
  rut: string;
  phone: string | null;
  email: string | null;
  position: string | null;
  active: boolean;
};

type Props = {
  initialWorkers: Worker[];
};

export default function TrabajadoresClient({
  initialWorkers,
}: Props) {
  const [workers, setWorkers] = useState(initialWorkers);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setEditingId(null);
    setName("");
    setRut("");
    setPhone("");
    setEmail("");
    setPosition("");
  }

  function handleEdit(worker: Worker) {
    setEditingId(worker.id);
    setName(worker.name);
    setRut(worker.rut);
    setPhone(worker.phone ?? "");
    setEmail(worker.email ?? "");
    setPosition(worker.position ?? "");
    setMessage("");
  }

  function handleCancelEdit() {
    resetForm();
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
      const response = await fetch("/api/workers", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(isEditing ? { id: editingId } : {}),
          name,
          rut,
          phone,
          email,
          position,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ??
            (isEditing
              ? "No se pudieron guardar los cambios."
              : "No se pudo registrar al trabajador."),
        );
        return;
      }

      if (isEditing) {
        setWorkers((previous) =>
          previous.map((worker) =>
            worker.id === editingId ? data.worker : worker,
          ),
        );
        setMessage("Trabajador actualizado correctamente.");
      } else {
        setWorkers((previous) => [...previous, data.worker]);
        setMessage("Trabajador registrado correctamente.");
      }

      resetForm();
    } catch {
      setMessage("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header>
        <h1>Gestión de trabajadores</h1>
        <p>Administra el personal de tu empresa.</p>
      </header>

      <p>
        <a href="/dashboard">← Volver al dashboard</a>
      </p>

      <section>
        <h2>
          {editingId !== null
            ? "Editar trabajador"
            : "Registrar trabajador"}
        </h2>

        <form onSubmit={handleSubmit}>
          <p>
            <label htmlFor="worker-name">Nombre completo *</label>
            <br />
            <input
              id="worker-name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </p>

          <p>
            <label htmlFor="worker-rut">RUT *</label>
            <br />
            <input
              id="worker-rut"
              name="rut"
              value={rut}
              onChange={(event) => setRut(event.target.value)}
              required
            />
          </p>

          <p>
            <label htmlFor="worker-position">Cargo</label>
            <br />
            <input
              id="worker-position"
              name="position"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
              placeholder="Ej.: Auxiliar de aseo"
            />
          </p>

          <p>
            <label htmlFor="worker-email">Correo electrónico</label>
            <br />
            <input
              id="worker-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </p>

          <p>
            <label htmlFor="worker-phone">Teléfono</label>
            <br />
            <input
              id="worker-phone"
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
                : "Registrar trabajador"}
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
        <h2>Trabajadores registrados ({workers.length})</h2>

        {workers.length === 0 ? (
          <p>Aún no hay trabajadores registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>RUT</th>
                <th>Cargo</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id}>
                  <td>{worker.name}</td>
                  <td>{worker.rut}</td>
                  <td>{worker.position ?? "—"}</td>
                  <td>{worker.email ?? "—"}</td>
                  <td>{worker.phone ?? "—"}</td>
                  <td>{worker.active ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(worker)}
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
