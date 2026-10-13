
"use client";

import { useState } from "react";

type ServiceType = {
  id: number;
  name: string;
  description: string | null;
  estimatedMinutes: number | null;
  active: boolean;
};

type Props = {
  initialServiceTypes: ServiceType[];
};

export default function ServiciosClient({
  initialServiceTypes,
}: Props) {
  const [serviceTypes, setServiceTypes] = useState(initialServiceTypes);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/service-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          estimatedMinutes: estimatedMinutes.trim()
            ? Number(estimatedMinutes)
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ?? "No se pudo registrar el tipo de servicio.",
        );
        return;
      }

      setServiceTypes((current) => [
        ...current,
        data.serviceType as ServiceType,
      ]);

      setName("");
      setDescription("");
      setEstimatedMinutes("");
      setMessage("Tipo de servicio registrado correctamente.");
    } catch {
      setMessage("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header>
        <h1>Gestión de servicios</h1>
        <p>Administra los tipos de servicio de tu empresa.</p>
      </header>

      <p>
        <a href="/dashboard">← Volver al dashboard</a>
      </p>

      <section>
        <h2>Registrar tipo de servicio</h2>

        <form onSubmit={handleSubmit}>
          <p>
            <label htmlFor="name">Nombre del servicio *</label>
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
            <label htmlFor="description">Descripción</label>
            <br />
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </p>

          <p>
            <label htmlFor="estimatedMinutes">
              Duración estimada (minutos)
            </label>
            <br />
            <input
              id="estimatedMinutes"
              name="estimatedMinutes"
              type="number"
              min="1"
              step="1"
              value={estimatedMinutes}
              onChange={(event) =>
                setEstimatedMinutes(event.target.value)
              }
            />
          </p>

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar servicio"}
          </button>

          {message && <p role="status">{message}</p>}
        </form>
      </section>

      <section>
        <h2>
          Tipos de servicio registrados ({serviceTypes.length})
        </h2>

        {serviceTypes.length === 0 ? (
          <p>Aún no hay tipos de servicio registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Duración estimada</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {serviceTypes.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.description || "—"}</td>
                  <td>
                    {service.estimatedMinutes !== null
                      ? `${service.estimatedMinutes} min`
                      : "—"}
                  </td>
                  <td>{service.active ? "Activo" : "Inactivo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
