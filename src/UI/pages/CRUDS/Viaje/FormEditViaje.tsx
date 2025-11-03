import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IViajeResponse } from "../../../../models/IViaje";
import {
  updateViajeUseCase,
  getViajeByIdUseCase,
} from "../../../../application/viajjeUseCases";

const FormEditViaje: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<IViajeResponse>>({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Cargar datos del viaje cuando se monta el componente
  useEffect(() => {
    const fetchViaje = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const data = await getViajeByIdUseCase(id);
        setForm(data);
        setSuccess("✅ Viaje cargado correctamente");
      } catch (error: any) {
        console.error("❌ Error al cargar el viaje:", error);
        setError(error.message || "No se pudieron cargar los datos del viaje.");
      } finally {
        setLoading(false);
      }
    };
    fetchViaje();
  }, [id]);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setError("");
    setSuccess("");
    setUpdating(true);

    try {
      await updateViajeUseCase(id, {
        origen: form.origen || "",
        destino: form.destino || "",
        fecha_salida: form.fecha_salida || "",
        fecha_llegada: form.fecha_llegada || "",
        estado: form.estado || "pendiente",
      });

      setSuccess("✅ Viaje actualizado correctamente");
      setTimeout(() => navigate("/viajes/search"), 1500);
    } catch (error: any) {
      console.error("❌ Error al actualizar el viaje:", error);
      setError(error.message || "Error al actualizar el viaje. Intenta nuevamente.");
    } finally {
      setUpdating(false);
    }
  };

  // 🔹 Estado de carga
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "3rem",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              margin: "0 auto 1rem",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: "#4a5568", fontSize: "1.1rem", margin: 0 }}>
            Cargando información del viaje...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  // 🔹 Error: viaje no encontrado
  if (!loading && error && !form._id) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "3rem",
            borderRadius: "20px",
            textAlign: "center",
            maxWidth: "500px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ color: "#c53030", margin: "0 0 1rem 0" }}>
            Viaje no encontrado
          </h2>
          <p style={{ color: "#4a5568", marginBottom: "2rem" }}>
            No se pudo encontrar el viaje especificado.
          </p>
          <button
            onClick={() => navigate("/viajes/buscar")}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Volver a Viajes
          </button>
        </div>
      </div>
    );
  }

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
            ← Volver a Viajes
          </button>
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
              <span style={{ fontSize: "3rem" }}>✏️</span>
            </div>
            <h2
              style={{
                fontSize: "2rem",
                color: "#2d3748",
                margin: "0 0 0.5rem 0",
                fontWeight: "700",
              }}
            >
              Editar Viaje
            </h2>
            <p style={{ color: "#718096", margin: 0 }}>
              Modifique la información del viaje
            </p>
          </div>
        </div>

        {/* Alertas */}
        {error && (
          <div
            style={{
              background: "#fed7d7",
              color: "#c53030",
              padding: "1rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              border: "1px solid #fc8181",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              animation: "slideDown 0.3s ease",
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
              borderRadius: "12px",
              marginBottom: "1.5rem",
              border: "1px solid #68d391",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              animation: "slideDown 0.3s ease",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Información del Viaje */}
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
                marginBottom: "1.25rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>🗺️</span> Información del Viaje
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Origen y Destino */}
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
                    value={form.origen || ""}
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
                    value={form.destino || ""}
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

              {/* Fechas */}
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
                    value={
                      form.fecha_salida
                        ? new Date(form.fecha_salida).toISOString().slice(0, 16)
                        : ""
                    }
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
                    value={
                      form.fecha_llegada
                        ? new Date(form.fecha_llegada).toISOString().slice(0, 16)
                        : ""
                    }
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

              {/* Estado */}
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
                  ⚙️ Estado del Viaje *
                </label>
                <select
                  name="estado"
                  value={form.estado || "pendiente"}
                  onChange={handleChange}
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
                  <option value="pendiente">⏳ Pendiente</option>
                  <option value="en-curso">🚌 En Curso</option>
                  <option value="completado">✅ Completado</option>
                  <option value="cancelado">❌ Cancelado</option>
                </select>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#718096",
                    marginTop: "0.5rem",
                    marginBottom: 0,
                  }}
                >
                  Seleccione el estado actual del viaje
                </p>
              </div>
            </div>
          </div>

          {/* Información de Recursos (solo lectura) */}
          {(form.conductor_id || form.bus_id || form.ruta_id) && (
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
                  marginBottom: "1.25rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>🚍</span> Recursos Asignados
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                {form.conductor_id && (
                  <div>
                    <p
                      style={{
                        color: "#718096",
                        fontSize: "0.85rem",
                        margin: "0 0 0.25rem 0",
                        fontWeight: "500",
                      }}
                    >
                      👤 Conductor
                    </p>
                    <p
                      style={{
                        color: "#2d3748",
                        fontSize: "1rem",
                        margin: 0,
                        fontWeight: "600",
                      }}
                    >
                      {typeof form.conductor_id === 'object' && form.conductor_id?.datos_personal
                        ? `${form.conductor_id.datos_personal.nombres} ${form.conductor_id.datos_personal.apellidos}`
                        : "N/A"}
                    </p>
                  </div>
                )}
                {form.bus_id && (
                  <div>
                    <p
                      style={{
                        color: "#718096",
                        fontSize: "0.85rem",
                        margin: "0 0 0.25rem 0",
                        fontWeight: "500",
                      }}
                    >
                      🚌 Bus
                    </p>
                    <p
                      style={{
                        color: "#2d3748",
                        fontSize: "1rem",
                        margin: 0,
                        fontWeight: "600",
                        fontFamily: "monospace",
                      }}
                    >
                      {typeof form.bus_id === 'object' && form.bus_id?.placa
                        ? form.bus_id.placa
                        : "N/A"}
                    </p>
                  </div>
                )}
                {form.ruta_id && (
                  <div>
                    <p
                      style={{
                        color: "#718096",
                        fontSize: "0.85rem",
                        margin: "0 0 0.25rem 0",
                        fontWeight: "500",
                      }}
                    >
                      🗺️ Ruta
                    </p>
                    <p
                      style={{
                        color: "#2d3748",
                        fontSize: "1rem",
                        margin: 0,
                        fontWeight: "600",
                      }}
                    >
                      {typeof form.ruta_id === 'object' && form.ruta_id?.nombre
                        ? form.ruta_id.nombre
                        : "N/A"}
                    </p>
                  </div>
                )}
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#718096",
                  marginTop: "1rem",
                  marginBottom: 0,
                }}
              >
                ℹ️ Los recursos asignados no pueden ser modificados desde aquí
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              paddingTop: "1rem",
              borderTop: "2px solid #e2e8f0",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/viajes/buscar")}
              disabled={updating}
              style={{
                flex: 1,
                background: "#fff",
                color: "#4a5568",
                padding: "1rem",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: updating ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                if (!updating) {
                  e.currentTarget.style.background = "#f7fafc";
                  e.currentTarget.style.borderColor = "#cbd5e0";
                }
              }}
              onMouseOut={(e) => {
                if (!updating) {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }
              }}
            >
              🔙 Cancelar
            </button>
            <button
              type="submit"
              disabled={updating}
              style={{
                flex: 1,
                background: updating
                  ? "#a0aec0"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                padding: "1rem",
                border: "none",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: updating ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: updating ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              onMouseOver={(e) => {
                if (!updating) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                }
              }}
              onMouseOut={(e) => {
                if (!updating) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                }
              }}
            >
              {updating ? (
                <>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "3px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "3px solid #fff",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
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
          
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default FormEditViaje;