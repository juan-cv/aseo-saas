
"use client";

import { useState } from "react";

type Customer = {
  id: number;
  name: string;
};

type Location = {
  id: number;
  customerId: number;
  name: string;
  address: string;
  commune: string | null;
  contactName: string | null;
  contactPhone: string | null;
  instructions: string | null;
  active: boolean;
};

type Props = {
  initialCustomers: Customer[];
  initialLocations: Location[];
};

export default function UbicacionesClient({
  initialCustomers,
  initialLocations,
}: Props) {
  const [locations, setLocations] = useState(initialLocations);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [commune, setCommune] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [instructions, setInstructions] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setEditingId(null);
    setCustomerId("");
    setName("");
    setAddress("");
    setCommune("");
    setContactName("");
    setContactPhone("");
    setInstructions("");
  }

  function handleEdit(location: Location) {
    setEditingId(location.id);
    setCustomerId(String(location.customerId));
    setName(location.name);
    setAddress(location.address);
    setCommune(location.commune ?? "");
    setContactName(location.contactName ?? "");
    setContactPhone(location.contactPhone ?? "");
    setInstructions(location.instructions ?? "");
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    resetForm();
    setMessage("Edición cancelada.");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const isEditing = editingId !== null;

    try {
      const response = await fetch("/api/locations", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(isEditing ? { id: editingId } : {}),
          customerId: Number(customerId),
          name,
          address,
          commune,
          contactName,
          contactPhone,
          instructions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ??
            (isEditing
              ? "No se pudo actualizar la ubicación."
              : "No se pudo registrar la ubicación."),
        );
        return;
      }

      if (isEditing) {
        setLocations((previous) =>
          previous.map((location) =>
            location.id === editingId
              ? data.location
              : location,
          ),
        );
        setMessage("Ubicación actualizada correctamente.");
      } else {
        setLocations((previous) => [
          ...previous,
          data.location,
        ]);
        setMessage("Ubicación registrada correctamente.");
      }

      resetForm();
    } catch {
      setMessage("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  const customerNames = new Map(
    initialCustomers.map((customer) => [
      customer.id,
      customer.name,
    ]),
  );

  return (
    <main>
      <header>
        <h1>Ubicaciones</h1>
        <p>
          Administra las instalaciones donde se realizan
          los servicios de aseo.
        </p>
      </header>

      <p>
        <a href="/dashboard">← Volver al dashboard</a>
      </p>

      <section>
        <h2>
          {editingId !== null
            ? "Editar instalación"
            : "Registrar instalación"}
        </h2>

        {initialCustomers.length === 0 ? (
          <p>
            Primero debes registrar un cliente para poder
            crear una ubicación.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <p>
              <label htmlFor="customerId">Cliente *</label>
              <select
                id="customerId"
                value={customerId}
                onChange={(event) =>
                  setCustomerId(event.target.value)
                }
                required
              >
                <option value="">Selecciona un cliente</option>
                {initialCustomers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}
                  </option>
                ))}
              </select>
            </p>

            <p>
              <label htmlFor="name">
                Nombre de la instalación *
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Ej.: Planta principal"
                required
              />
            </p>

            <p>
              <label htmlFor="address">Dirección *</label>
              <input
                id="address"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                placeholder="Calle y número"
                required
              />
            </p>

            <p>
              <label htmlFor="commune">Comuna</label>
              <input
                id="commune"
                value={commune}
                onChange={(event) =>
                  setCommune(event.target.value)
                }
                placeholder="Ej.: Providencia"
              />
            </p>

            <p>
              <label htmlFor="contactName">
                Nombre del contacto
              </label>
              <input
                id="contactName"
                value={contactName}
                onChange={(event) =>
                  setContactName(event.target.value)
                }
              />
            </p>

            <p>
              <label htmlFor="contactPhone">
                Teléfono de contacto
              </label>
              <input
                id="contactPhone"
                type="tel"
                value={contactPhone}
                onChange={(event) =>
                  setContactPhone(event.target.value)
                }
                placeholder="+56 9 ..."
              />
            </p>

            <p>
              <label htmlFor="instructions">
                Instrucciones para el personal
              </label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(event) =>
                  setInstructions(event.target.value)
                }
                placeholder="Acceso, protocolos o indicaciones especiales"
              />
            </p>

            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={loading}>
                {loading
                  ? "Guardando..."
                  : editingId !== null
                    ? "Guardar cambios"
                    : "Registrar ubicación"}
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
            </div>
          </form>
        )}

        {message && <p role="status">{message}</p>}
      </section>

      <section>
        <h2>
          Instalaciones registradas ({locations.length})
        </h2>

        {locations.length === 0 ? (
          <p>Todavía no hay ubicaciones registradas.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {locations.map((location) => (
              <article
                key={location.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {location.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {customerNames.get(location.customerId) ??
                        "Cliente"}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {location.active ? "Activa" : "Inactiva"}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-700">
                  {location.address}
                  {location.commune
                    ? `, ${location.commune}`
                    : ""}
                </p>

                {location.contactName && (
                  <p className="mt-2 text-sm">
                    Contacto: {location.contactName}
                  </p>
                )}

                {location.contactPhone && (
                  <p className="text-sm">
                    Teléfono: {location.contactPhone}
                  </p>
                )}

                {location.instructions && (
                  <p className="mt-2 text-sm text-slate-600">
                    {location.instructions}
                  </p>
                )}

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(location)}
                    disabled={loading}
                  >
                    Editar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
