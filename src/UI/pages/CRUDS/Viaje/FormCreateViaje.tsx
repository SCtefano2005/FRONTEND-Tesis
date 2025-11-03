import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createViajeUseCase } from "../../../../application/viajjeUseCases";
import { getAllRutasUseCase } from "../../../../application/rutaUseCases";
import { IAdministrador } from "../../../../models/IAdministrador";
import { IRutaResponse } from "../../../../models/IRuta";
import { useAuthStore } from '../../../../stores/useAuthStore';

const FormCreateViaje: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<IAdministrador | null>(null);
  const [rutas, setRutas] = useState<IRutaResponse[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRutas, setLoadingRutas] = useState(false);
  const perfil = useAuthStore((state) => state.perfil);

  const [form, setForm] = useState({
    creador_email: "",
    conductor_dni: "",
    bus_placa: "",
    ruta_nombre: "",
    origen: "",
    destino: "",
    fecha_salida: new Date().toISOString().slice(0, 16),
    fecha_llegada: new Date().toISOString().slice(0, 16),
  });

  // 🔹 Obtener el admin desde localStorage
  useEffect(() => {
    const perfil = useAuthStore.getState().perfil;

    if (perfil) {
      const emailAdmin = perfil.email || "";
      setAdmin(perfil);
      setForm((prev) => ({
        ...prev,
        creador_email: emailAdmin,
      }));
      console.log("📩 Email del admin detectado desde Zustand:", emailAdmin);
    }
  }, []);

  // 🔹 Cargar rutas disponibles
  useEffect(() => {
    const fetchRutas = async () => {
      setLoadingRutas(true);
      try {
        const rutasData = await getAllRutasUseCase();
        setRutas(rutasData);
      } catch (error: any) {
        console.error("Error al cargar rutas:", error.message);
      } finally {
        setLoadingRutas(false);
      }
    };
    fetchRutas();
  }, []);

  // 🔹 Manejar cambios del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🔹 Limpiar formulario
  const handleNuevoViaje = () => {
    setForm({
      creador_email: admin?.email || "",
      conductor_dni: "",
      bus_placa: "",
      ruta_nombre: "",
      origen: "",
      destino: "",
      fecha_salida: new Date().toISOString().slice(0, 16),
      fecha_llegada: new Date().toISOString().slice(0, 16),
    });
    setMensaje("");
  };

  // 🔹 Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      if (!admin) throw new Error("Administrador no encontrado");

      const viajePayload = {
        creador_email: admin.email,
        conductor_dni: form.conductor_dni,
        bus_placa: form.bus_placa,
        ruta_nombre: form.ruta_nombre,
        origen: form.origen,
        destino: form.destino,
        fecha_salida: new Date(form.fecha_salida).toISOString(),
        fecha_llegada: new Date(form.fecha_llegada).toISOString(),
      };

      console.log("📤 Datos enviados al backend:", viajePayload);

      await createViajeUseCase(viajePayload);
      setMensaje("✅ Viaje creado correctamente");

      // 🔄 Limpiar formulario
      setForm({
        creador_email: admin.email,
        conductor_dni: "",
        bus_placa: "",
        ruta_nombre: "",
        origen: "",
        destino: "",
        fecha_salida: new Date().toISOString().slice(0, 16),
        fecha_llegada: new Date().toISOString().slice(0, 16),
      });
    } catch (error: any) {
      console.error(error);
      setMensaje("❌ Error al crear viaje: " + (error.message || "Error desconocido"));
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
          maxWidth: "800px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          padding: "2.5rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/viaje/search")}
              style={{
                background: "transparent",
                border: "2px solid #667eea",
                color: "#667eea",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "600",
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
              ← Volver a Viajes
            </button>

            <button
              onClick={handleNuevoViaje}
              disabled={loading}
              style={{
                background: loading ? "#cbd5e0" : "rgba(102, 126, 234, 0.1)",
                border: "2px solid #667eea",
                color: "#667eea",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.9rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "#667eea";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
                  e.currentTarget.style.color = "#667eea";
                }
              }}
            >
              <span>➕</span>
              <span>Nuevo Viaje</span>
            </button>
          </div>

          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50%",
                padding: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontSize: "3rem" }}>🚌</span>
            </div>
            <h2
              style={{
                fontSize: "2rem",
                color: "#2d3748",
                margin: "0 0 0.5rem 0",
                fontWeight: "700",
              }}
            >
              Crear Viaje
            </h2>
            <p style={{ color: "#718096", margin: 0 }}>
              Complete los datos del nuevo viaje
            </p>
          </div>
        </div>

        {/* Alertas */}
        {mensaje && (
          <div
            style={{
              background: mensaje.includes("❌") ? "#fed7d7" : "#c6f6d5",
              color: mensaje.includes("❌") ? "#c53030" : "#2f855a",
              padding: "1rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              border: mensaje.includes("❌") ? "1px solid #fc8181" : "1px solid #68d391",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              animation: "slideDown 0.3s ease",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>
              {mensaje.includes("❌") ? "⚠️" : "✅"}
            </span>
            <span>{mensaje}</span>
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Información del Administrador */}
          <div
            style={{
              background: "#f7fafc",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                marginBottom: "1rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>👤</span> Creador del Viaje
            </h3>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#4a5568",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Email del Administrador
              </label>
              <input
                type="text"
                name="creador_email"
                value={form.creador_email}
                readOnly
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f7fafc",
                  color: "#718096",
                  cursor: "not-allowed",
                }}
              />
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#718096",
                  marginTop: "0.5rem",
                  marginBottom: 0,
                }}
              >
                Este campo se completa automáticamente
              </p>
            </div>
          </div>

          {/* Asignación de Recursos */}
          <div
            style={{
              background: "#f7fafc",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                marginBottom: "1rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>🚍</span> Asignación de Recursos
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#4a5568",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  DNI del Conductor *
                </label>
                <input
                  type="text"
                  name="conductor_dni"
                  value={form.conductor_dni}
                  onChange={handleChange}
                  placeholder="Ejemplo: 72638987"
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#4a5568",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  Placa del Bus *
                </label>
                <input
                  type="text"
                  name="bus_placa"
                  value={form.bus_placa}
                  onChange={handleChange}
                  placeholder="Ejemplo: ABC-123"
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    textTransform: "uppercase",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#4a5568",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  Ruta *
                </label>
                <select
                  name="ruta_nombre"
                  value={form.ruta_nombre}
                  onChange={handleChange}
                  required
                  disabled={loadingRutas}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    cursor: loadingRutas ? "wait" : "pointer",
                    background: "#fff",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="">
                    {loadingRutas ? "Cargando rutas..." : "Selecciona una ruta"}
                  </option>
                  {rutas.map((r) => (
                    <option key={r._id} value={r.nombre}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Datos del Viaje */}
          <div
            style={{
              background: "#f7fafc",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                marginBottom: "1rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>🗺️</span> Datos del Viaje
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
                      fontWeight: "600",
                    }}
                  >
                    📍 Origen *
                  </label>
                  <input
                    type="text"
                    name="origen"
                    value={form.origen}
                    onChange={handleChange}
                    placeholder="Ciudad de origen"
                    required
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                    }}
                  >
                    🏁 Destino *
                  </label>
                  <input
                    type="text"
                    name="destino"
                    value={form.destino}
                    onChange={handleChange}
                    placeholder="Ciudad de destino"
                    required
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                    }}
                  >
                    📅 Fecha de Salida *
                  </label>
                  <input
                    type="datetime-local"
                    name="fecha_salida"
                    value={form.fecha_salida}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                    }}
                  >
                    🕓 Fecha de Llegada *
                  </label>
                  <input
                    type="datetime-local"
                    name="fecha_llegada"
                    value={form.fecha_llegada}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
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
              borderRadius: "12px",
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
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            {loading ? "Creando..." : "Crear Viaje"}
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default FormCreateViaje;