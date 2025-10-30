import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdminUseCase } from "../../../../application/adminUseCases";
import { IAdministradorCreate } from "../../../../models/IAdministrador";

export default function CrearAdministrador() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    identificacion: "",
    password: "",
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    area: "",
    nivel: "admin_local",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const telefonoNormalizado = form.telefono.startsWith("+51")
        ? form.telefono
        : `+51${form.telefono}`;

      const dniNormalizado = form.identificacion.startsWith("DNI-")
        ? form.identificacion
        : `DNI-${form.identificacion}`;

      // 🔹 Construir objeto según modelo IAdministradorCreate
      const data: IAdministradorCreate = {
        identificacion: dniNormalizado,
        password: form.password || "Admin1234",
        rol: "admin",
        estado: "activo",
        datos_personal: {
          nombres: form.nombres || "Nombre Genérico",
          apellidos: form.apellidos || "Apellido Genérico",
          email: form.email || "ejemplo@correo.com",
          telefono: telefonoNormalizado || "+51999999999",
          direccion: form.direccion || "Dirección por defecto",
        },
        config_sesion: {
          notificaciones: true,
          tema: "oscuro",
        },
        administrador: {
          area: form.area || "Operaciones",
          nivel: form.nivel as "superadmin" | "admin_local",
          permisos: [],
        },
      };

      await createAdminUseCase(data);

      setSuccess("✅ Administrador creado correctamente");
      setForm({
        identificacion: "",
        password: "",
        nombres: "",
        apellidos: "",
        email: "",
        telefono: "",
        direccion: "",
        area: "",
        nivel: "admin_local",
      });
    } catch (err: any) {
      console.error("❌ Error al crear administrador:", err.response?.data || err);
      setError(err.response?.data?.message || "❌ Error al crear administrador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          padding: "2.5rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "transparent",
              border: "2px solid #667eea",
              color: "#667eea",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "600",
              marginBottom: "1rem",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#667eea";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#667eea";
            }}
          >
            ← Volver al Dashboard
          </button>
          <h2
            style={{
              fontSize: "2rem",
              color: "#2d3748",
              margin: "0",
              fontWeight: "700",
            }}
          >
            👨‍💼 Crear Administrador
          </h2>
          <p style={{ color: "#718096", marginTop: "0.5rem" }}>
            Complete los datos del nuevo administrador
          </p>
        </div>

        {/* Alertas */}
        {error && (
          <div
            style={{
              background: "#fed7d7",
              color: "#c53030",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "1px solid #fc8181",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div
            style={{
              background: "#c6f6d5",
              color: "#2f855a",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "1px solid #68d391",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Datos de Acceso */}
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                marginBottom: "1rem",
                fontWeight: "600",
              }}
            >
              🔐 Datos de Acceso
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#4a5568",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  Identificación (DNI)
                </label>
                <input
                  name="identificacion"
                  placeholder="Ej: 12345678"
                  value={form.identificacion}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.3s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#4a5568",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  Contraseña
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.3s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
            </div>
          </div>

          {/* Datos Personales */}
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                marginBottom: "1rem",
                fontWeight: "600",
              }}
            >
              👤 Datos Personales
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Nombres
                  </label>
                  <input
                    name="nombres"
                    placeholder="Nombres"
                    value={form.nombres}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Apellidos
                  </label>
                  <input
                    name="apellidos"
                    placeholder="Apellidos"
                    value={form.apellidos}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#4a5568",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="ejemplo@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.3s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Teléfono
                  </label>
                  <input
                    name="telefono"
                    placeholder="987654321"
                    value={form.telefono}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Dirección
                  </label>
                  <input
                    name="direccion"
                    placeholder="Dirección"
                    value={form.direccion}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Datos Administrativos */}
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                marginBottom: "1rem",
                fontWeight: "600",
              }}
            >
              ⚙️ Datos Administrativos
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Área
                  </label>
                  <input
                    name="area"
                    placeholder="Ej: Operaciones"
                    value={form.area}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Nivel de Acceso
                  </label>
                  <select
                    name="nivel"
                    value={form.nivel}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s",
                      boxSizing: "border-box",
                      cursor: "pointer",
                      background: "#fff",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                  >
                    <option value="admin_local">Administrador Local</option>
                    <option value="superadmin">Super Administrador</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading
                ? "#a0aec0"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              padding: "1rem",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              marginTop: "1rem",
              boxShadow: loading ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(102, 126, 234, 0.6)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            {loading ? "⏳ Creando..." : "✨ Crear Administrador"}
          </button>
        </form>
      </div>
    </div>
  );
}