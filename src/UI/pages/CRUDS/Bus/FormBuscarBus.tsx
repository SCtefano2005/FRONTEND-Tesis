import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBusByPlacaUseCase, deleteBusUseCase } from "../../../../application/busUseCases";
import { getEsp32ByIdentificacionUseCase, getEsp32ByIdUseCase } from "../../../../application/esp32UseCases";
import { IBusResponse } from "../../../../models/IBus";
import { IEsp32Response } from "../../../../models/IEsp32";

const FormBuscarBus: React.FC = () => {
  const navigate = useNavigate();
  const [placa, setPlaca] = useState("");
  const [bus, setBus] = useState<IBusResponse | null>(null);
  const [esp32, setEsp32] = useState<IEsp32Response | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setBus(null);
    setEsp32(null);
    setLoading(true);

    try {
      const resultado = await getBusByPlacaUseCase(placa.trim());

      if (!resultado) {
        setMensaje("❌ No se encontró ningún bus con esa placa.");
        setLoading(false);
        return;
      }

      setBus(resultado);

      // LOG para depuración: ver qué trae el bus
      console.log("Bus obtenido:", resultado);
      console.log("Valor de resultado.esp32_id:", resultado.esp32_id);

      // Si no hay esp32_id -> nada más que hacer
      if (!resultado.esp32_id) {
        setMensaje("ℹ️ Bus encontrado (sin ESP32 asociado).");
        setLoading(false);
        return;
      }

      // 1) Intentar buscar por ID (MongoDB) -> endpoint /api/esp32/byid/:id
      try {
        const esp32ById = await getEsp32ByIdentificacionUseCase(resultado.esp32_id);
        console.log("ESP32 obtenido por byid:", esp32ById);
        setEsp32(esp32ById);
        setMensaje("✅ Bus encontrado correctamente");
        setLoading(false);
        return;
      } catch (errById: any) {
        console.warn("No se encontró ESP32 por byid:", errById?.response?.status, errById?.message);
        // Continúa al fallback
      }

      // 2) Fallback: intentar buscar por 'codigo' -> endpoint /api/esp32/:codigo
      try {
        const esp32ByCodigo = await getEsp32ByIdUseCase(resultado.esp32_id);
        console.log("ESP32 obtenido por codigo:", esp32ByCodigo);
        setEsp32(esp32ByCodigo);
        setMensaje("✅ Bus encontrado correctamente");
        setLoading(false);
        return;
      } catch (errByCode: any) {
        console.warn("No se encontró ESP32 por codigo:", errByCode?.response?.status, errByCode?.message);
        setMensaje("⚠️ Bus encontrado, pero no se pudo cargar el ESP32 asociado.");
        setEsp32(null);
        setLoading(false);
        return;
      }
    } catch (error: any) {
      console.error("Error al buscar el bus:", error);
      setMensaje("⚠️ Error al buscar el bus: " + (error?.message || error));
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  const handleCrearBus = () => {
    navigate("/bus/create");
  };

  const handleEditarBus = () => {
    if (bus) {
      navigate(`/bus/edit/${bus.placa}`);
    }
  };

  const handleEliminarBus = async () => {
    if (!bus) return;

    setDeleting(true);
    try {
      await deleteBusUseCase(bus.placa);
      setMensaje(`✅ Bus "${bus.placa}" eliminado correctamente`);
      
      // Limpiar datos
      setBus(null);
      setEsp32(null);
      setShowDeleteModal(false);
      setPlaca("");
    } catch (error: any) {
      setMensaje("❌ Error al eliminar bus: " + error.message);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Header con botones */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ← Volver al Dashboard
          </button>

          <button
            onClick={handleCrearBus}
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              color: "#667eea",
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
            }}
          >
            <span>➕</span>
            <span>Nuevo Bus</span>
          </button>
        </div>

        {/* Card de búsqueda */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            padding: "2.5rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
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
              Buscar Bus por Placa
            </h2>
            <p style={{ color: "#718096", margin: 0 }}>
              Ingrese la placa del vehículo para ver su información
            </p>
          </div>

          {/* Barra de búsqueda */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <input
                type="text"
                placeholder="Ejemplo: ABC-123"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                required
                style={{
                  flex: 1,
                  padding: "1rem 1.5rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease",
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
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading
                    ? "#cbd5e0"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  padding: "1rem 2rem",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: loading ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
                  whiteSpace: "nowrap",
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
                {loading ? "🔄 Buscando..." : "🔍 Buscar"}
              </button>
            </div>
          </form>

          {/* Mensaje de estado */}
          {mensaje && (
            <div
              style={{
                background: mensaje.includes("❌")
                  ? "#fed7d7"
                  : mensaje.includes("⚠️")
                  ? "#feebc8"
                  : mensaje.includes("ℹ️")
                  ? "#bee3f8"
                  : "#c6f6d5",
                color: mensaje.includes("❌")
                  ? "#c53030"
                  : mensaje.includes("⚠️")
                  ? "#c05621"
                  : mensaje.includes("ℹ️")
                  ? "#2c5282"
                  : "#2f855a",
                padding: "1rem",
                borderRadius: "12px",
                border: mensaje.includes("❌")
                  ? "1px solid #fc8181"
                  : mensaje.includes("⚠️")
                  ? "1px solid #fbd38d"
                  : mensaje.includes("ℹ️")
                  ? "1px solid #90cdf4"
                  : "1px solid #68d391",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                animation: "slideDown 0.3s ease",
              }}
            >
              <span>{mensaje}</span>
            </div>
          )}
        </div>

        {/* Card de resultados */}
        {bus && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              padding: "2.5rem",
              animation: "fadeIn 0.5s ease",
            }}
          >
            {/* Header del bus */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
                paddingBottom: "1.5rem",
                borderBottom: "2px solid #e2e8f0",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    width: "60px",
                    height: "60px",
                    borderRadius: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                  }}
                >
                  🚌
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.75rem",
                      color: "#2d3748",
                      margin: "0 0 0.25rem 0",
                      fontWeight: "700",
                    }}
                  >
                    {bus.placa}
                  </h3>
                  <p style={{ color: "#718096", margin: 0, fontSize: "0.95rem" }}>
                    {bus.modelo} • {bus.anno}
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={handleEditarBus}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                    whiteSpace: "nowrap",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={openDeleteModal}
                  style={{
                    background: "linear-gradient(135deg, #f56565 0%, #c53030 100%)",
                    color: "#fff",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(245, 101, 101, 0.3)",
                    whiteSpace: "nowrap",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 101, 101, 0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(245, 101, 101, 0.3)";
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            {/* Información del bus */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {/* Información del Vehículo */}
              <div
                style={{
                  background: "#f7fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                }}
              >
                <h4
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
                  <span>🚍</span> Información del Vehículo
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <p
                      style={{
                        color: "#718096",
                        fontSize: "0.85rem",
                        margin: "0 0 0.25rem 0",
                        fontWeight: "500",
                      }}
                    >
                      Placa
                    </p>
                    <p
                      style={{
                        color: "#2d3748",
                        fontSize: "1rem",
                        margin: 0,
                        fontWeight: "600",
                      }}
                    >
                      {bus.placa}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#718096",
                        fontSize: "0.85rem",
                        margin: "0 0 0.25rem 0",
                        fontWeight: "500",
                      }}
                    >
                      Modelo
                    </p>
                    <p
                      style={{
                        color: "#2d3748",
                        fontSize: "1rem",
                        margin: 0,
                        fontWeight: "500",
                      }}
                    >
                      {bus.modelo}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#718096",
                        fontSize: "0.85rem",
                        margin: "0 0 0.25rem 0",
                        fontWeight: "500",
                      }}
                    >
                      Año
                    </p>
                    <p
                      style={{
                        color: "#2d3748",
                        fontSize: "1rem",
                        margin: 0,
                        fontWeight: "500",
                      }}
                    >
                      {bus.anno}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información del SOAT */}
              <div
                style={{
                  background: "#f7fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                }}
              >
                <h4
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
                  <span>📄</span> SOAT
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <p
                      style={{
                        color: "#718096",
                        fontSize: "0.85rem",
                        margin: "0 0 0.25rem 0",
                        fontWeight: "500",
                      }}
                    >
                      Número
                    </p>
                    <p
                      style={{
                        color: "#2d3748",
                        fontSize: "1rem",
                        margin: 0,
                        fontWeight: "600",
                      }}
                    >
                      {bus.soat?.numero || "No registrado"}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#718096",
                        fontSize: "0.85rem",
                        margin: "0 0 0.25rem 0",
                        fontWeight: "500",
                      }}
                    >
                      Fecha de Vencimiento
                    </p>
                    <p
                      style={{
                        color: "#2d3748",
                        fontSize: "1rem",
                        margin: 0,
                        fontWeight: "500",
                      }}
                    >
                      {bus.soat?.vence
                        ? new Date(bus.soat.vence).toLocaleDateString("es-ES")
                        : "No registrado"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información del ESP32 */}
              <div
                style={{
                  background: "#f7fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  gridColumn: "1 / -1",
                }}
              >
                <h4
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
                  <span>🔌</span> Dispositivo ESP32
                </h4>
                {esp32 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                    <div>
                      <p
                        style={{
                          color: "#718096",
                          fontSize: "0.85rem",
                          margin: "0 0 0.25rem 0",
                          fontWeight: "500",
                        }}
                      >
                        Código
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
                        {esp32.codigo}
                      </p>
                    </div>
                    {esp32.descripcion && (
                      <div>
                        <p
                          style={{
                            color: "#718096",
                            fontSize: "0.85rem",
                            margin: "0 0 0.25rem 0",
                            fontWeight: "500",
                          }}
                        >
                          Descripción
                        </p>
                        <p
                          style={{
                            color: "#2d3748",
                            fontSize: "1rem",
                            margin: 0,
                            fontWeight: "500",
                          }}
                        >
                          {esp32.descripcion}
                        </p>
                      </div>
                    )}
                    <div>
                      <p
                        style={{
                          color: "#718096",
                          fontSize: "0.85rem",
                          margin: "0 0 0.25rem 0",
                          fontWeight: "500",
                        }}
                      >
                        Estado
                      </p>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          background: esp32.activo ? "#c6f6d5" : "#fed7d7",
                          color: esp32.activo ? "#2f855a" : "#c53030",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                        }}
                      >
                        {esp32.activo ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </div>
                  </div>
                ) : bus.esp32_id ? (
                  <p style={{ color: "#718096", fontStyle: "italic", margin: 0 }}>
                    No se pudo cargar la información del ESP32
                  </p>
                ) : (
                  <p style={{ color: "#718096", fontStyle: "italic", margin: 0 }}>
                    Sin dispositivo ESP32 asociado
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && bus && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease",
          }}
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "2.5rem",
              borderRadius: "20px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              animation: "slideIn 0.3s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  color: "#2d3748",
                  margin: "0 0 1rem 0",
                  fontWeight: "700",
                }}
              >
                ¿Eliminar Bus?
              </h3>
              <p style={{ color: "#718096", margin: 0, lineHeight: "1.6" }}>
                Esta acción no se puede deshacer. Se eliminará permanentemente el bus con placa{" "}
                <strong>"{bus.placa}"</strong> del sistema.
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                style={{
                  flex: 1,
                  background: "#fff",
                  color: "#4a5568",
                  padding: "1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: deleting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (!deleting) {
                    e.currentTarget.style.background = "#f7fafc";
                    e.currentTarget.style.borderColor = "#cbd5e0";
                  }
                }}
                onMouseOut={(e) => {
                  if (!deleting) {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarBus}
                disabled={deleting}
                style={{
                  flex: 1,
                  background: deleting
                    ? "#a0aec0"
                    : "linear-gradient(135deg, #f56565 0%, #c53030 100%)",
                  color: "#fff",
                  padding: "1rem",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: deleting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: deleting ? "none" : "0 4px 15px rgba(245, 101, 101, 0.4)",
                }}
                onMouseOver={(e) => {
                  if (!deleting) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(245, 101, 101, 0.6)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!deleting) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(245, 101, 101, 0.4)";
                  }
                }}
              >
                {deleting ? "🔄 Eliminando..." : "🗑️ Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
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
          
          @keyframes slideIn {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default FormBuscarBus;