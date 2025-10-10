import React, { useState } from "react";
import { createConductorUseCase } from "../../../../application/conductorUseCases";
import { IConductor } from "../../../../models/IConductor"; // asegúrate de importar la interfaz correcta

export default function CrearConductor() {
  const [form, setForm] = useState({
    identificacion: "",
    password: "",
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    numero_licencia: "",
    categoria_lic: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de sesión");
      return;
    }

    try {
      // 🔑 Normalizar valores
      const telefonoNormalizado = form.telefono.startsWith("+51")
        ? form.telefono
        : `+51${form.telefono}`;
      const dniNormalizado = form.identificacion.startsWith("DNI-")
        ? form.identificacion
        : `DNI-${form.identificacion}`;

      // 🚀 Armar payload completo (con valores por defecto)
      const data: IConductor = {
        identificacion: dniNormalizado,
        password: form.password || "Hola1234",
        rol: "conductor" as const,
        estado: "activo" as const,
        datos_personal: {
          nombres: form.nombres || "Nombre Genérico",
          apellidos: form.apellidos || "Apellido Genérico",
          email: form.email || "ejemplo@correo.com",
          telefono: telefonoNormalizado || "+51999999999",
          direccion: form.direccion || "Dirección por defecto",
        },
        config_sesion: {
          notificaciones: true,
          tema: "oscuro" as const,
        },
        conductor: {
          numero_licencia: form.numero_licencia || "G00000000",
          categoria_lic: form.categoria_lic || "A1",
          estado_conduct: "activo" as const,
          documentos: [
            {
              nombre: "Licencia A1",
              url: "https://ejemplo.com/licencia_generica.pdf",
              vence: "2027-05-01T00:00:00.000Z",
            },
          ],
          experiencia: {
            anios: 1,
            historial: ["Sin experiencia previa"],
          },
        },
      };

      await createConductorUseCase(data);

      setSuccess("✅ Conductor creado correctamente");
      setForm({
        identificacion: "",
        password: "",
        nombres: "",
        apellidos: "",
        email: "",
        telefono: "",
        direccion: "",
        numero_licencia: "",
        categoria_lic: "",
      });
    } catch (err: any) {
      console.error("❌ Error al crear conductor:", err.response?.data);
      setError(err.response?.data?.message || "❌ Error al crear conductor");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Crear Conductor</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <input
          name="identificacion"
          placeholder="Identificación"
          value={form.identificacion}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />
        <input
          name="nombres"
          placeholder="Nombres"
          value={form.nombres}
          onChange={handleChange}
        />
        <input
          name="apellidos"
          placeholder="Apellidos"
          value={form.apellidos}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="telefono"
          placeholder="Teléfono (ej: 987654321)"
          value={form.telefono}
          onChange={handleChange}
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
        />
        <input
          name="numero_licencia"
          placeholder="Número de licencia"
          value={form.numero_licencia}
          onChange={handleChange}
        />
        <input
          name="categoria_lic"
          placeholder="Categoría licencia"
          value={form.categoria_lic}
          onChange={handleChange}
        />

        <button
          type="submit"
          style={{
            background: "#c00",
            color: "#fff",
            padding: "0.5rem",
            border: "none",
            borderRadius: 5,
          }}
        >
          Crear Conductor
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}
