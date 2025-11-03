import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createConductorUseCase } from "../../../../application/conductorUseCases";
import { IConductor } from "../../../../models/IConductor";

export default function CrearConductor() {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de sesión");
      setLoading(false);
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

      // 🚀 Armar payload completo
      const data: IConductor = {
        identificacion: dniNormalizado,
        password: form.password,
        rol: "conductor" as const,
        estado: "activo" as const,
        datos_personal: {
          nombres: form.nombres,
          apellidos: form.apellidos,
          email: form.email,
          telefono: telefonoNormalizado,
          direccion: form.direccion,
        },
        config_sesion: {
          notificaciones: true,
          tema: "oscuro" as const,
        },
        conductor: {
          numero_licencia: form.numero_licencia,
          categoria_lic: form.categoria_lic,
          estado_conduct: "activo" as const,
          documentos: [],
          experiencia: {
            anios: 1,
            historial: [],
          },
        },
      };

      const response = await createConductorUseCase(data);
      console.log("✅ Respuesta del servidor:", response);

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
      console.error("❌ Error al crear conductor:", err);

      const errorMsg =
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "❌ Error desconocido al crear conductor";

      setError(errorMsg);
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
          maxWidth: "600px",
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
            onClick={() => navigate("/buscar-conductor")}
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
            ← Volver a buscador
          </button>
          <h2
            style={{
              fontSize: "2rem",
              color: "#2d3748",
              margin: "0",
              fontWeight: "700",
            }}
          >
            Crear Conductor
          </h2>
          <p style={{ color: "#718096", marginTop: "0.5rem" }}>
            Complete los datos del nuevo conductor
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
            }}
          >
            {error}
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
            }}
          >
            {success}
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
              Datos de Acceso
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
              Datos Personales
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
          </div>

          {/* Datos de Licencia */}
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                marginBottom: "1rem",
                fontWeight: "600",
              }}
            >
              Datos de Licencia
            </h3>
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
                  Número de Licencia
                </label>
                <input
                  name="numero_licencia"
                  placeholder="Ej: L123456"
                  value={form.numero_licencia}
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
                  Categoría
                </label>
                <input
                  name="categoria_lic"
                  placeholder="Ej: A-IIb"
                  value={form.categoria_lic}
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
            {loading ? "Creando..." : "Crear Conductor"}
          </button>
        </form>
      </div>
    </div>
  );
}
