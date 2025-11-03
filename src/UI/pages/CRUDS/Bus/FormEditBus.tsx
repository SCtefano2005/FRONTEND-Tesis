import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBusByPlacaUseCase, updateBusUseCase } from "../../../../application/busUseCases";
import { getEsp32ByIdUseCase } from "../../../../application/esp32UseCases";
import { IBusResponse } from "../../../../models/IBus";

const FormEditBus: React.FC = () => {
  const { placa } = useParams<{ placa: string }>();
  const navigate = useNavigate();

  const [bus, setBus] = useState<IBusResponse | null>(null);
  const [codigoEsp32, setCodigoEsp32] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 🔹 Buscar bus automáticamente al cargar
  useEffect(() => {
    const fetchBus = async () => {
      if (!placa) return;
      setMensaje("");
      setLoading(true);
      try {
        const foundBus = await getBusByPlacaUseCase(placa.trim());
        if (!foundBus) {
          setMensaje("❌ No se encontró ningún bus con esa placa.");
          setBus(null);
        } else {
          setBus(foundBus);
          setMensaje("✅ Bus cargado correctamente");
        }
      } catch (error: any) {
        console.error("Error al buscar bus:", error);
        setMensaje("❌ Error al buscar bus: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [placa]);

  // 🔹 Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!bus) return;
    const { name, value } = e.target;

    if (name.startsWith("soat.")) {
      const soatField = name.split(".")[1];
      setBus({
        ...bus,
        soat: { ...bus.soat, [soatField]: value },
      });
    } else {
      setBus({ ...bus, [name]: value });
    }
  };

  // 🔹 Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bus) return;

    setMensaje("");
    setUpdating(true);

    try {
      let esp32_id = bus.esp32_id;

      // Si se cambió el código ESP32 manualmente
      if (codigoEsp32.trim() !== "") {
        const esp32 = await getEsp32ByIdUseCase(codigoEsp32.trim());
        if (!esp32 || !esp32._id) {
          setMensaje("❌ No se encontró ningún ESP32 con ese código.");
          setUpdating(false);
          return;
        }
        esp32_id = esp32._id;
      }

      const busEditado = {
        ...bus,
        esp32_id,
        soat: {
          numero: bus.soat.numero,
          vence: new Date(bus.soat.vence).toISOString(),
        },
      };

      await updateBusUseCase(bus.placa, busEditado);
      setMensaje("✅ Bus actualizado correctamente.");
      
      setTimeout(() => navigate("/bus/search"), 1500);
    } catch (error: any) {
      console.error("Error al actualizar bus:", error);
      setMensaje("❌ Error al actualizar bus: " + (error.response?.data?.message || error.message));
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
            Cargando información del bus...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  // 🔹 Error: bus no encontrado
  if (!bus && !loading) {
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
            Bus no encontrado
          </h2>
          <p style={{ color: "#4a5568", marginBottom: "2rem" }}>
            No se pudo encontrar el bus con la placa especificada.
          </p>
          <button
            onClick={() => navigate("/bus/buscar")}
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
            Volver a Buscar Buses
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
              Editar Bus
            </h2>
            <p style={{ color: "#718096", margin: 0 }}>
              Modifique la información del vehículo
            </p>
          </div>
        </div>

        {/* Alertas */}
        {mensaje && (
          <div
            style={{
              background: mensaje.includes("❌")
                ? "#fed7d7"
                : "#c6f6d5",
              color: mensaje.includes("❌")
                ? "#c53030"
                : "#2f855a",
              padding: "1rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              border: mensaje.includes("❌")
                ? "1px solid #fc8181"
                : "1px solid #68d391",
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
        {bus && (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Información del Bus */}
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
                <span>🚍</span> Información del Vehículo
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Placa (deshabilitada) */}
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
                    Placa del Bus
                  </label>
                  <input
                    type="text"
                    value={bus.placa}
                    disabled
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
                      textTransform: "uppercase",
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
                    La placa no puede ser modificada
                  </p>
                </div>

                {/* Modelo y Año */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
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
                      Modelo *
                    </label>
                    <input
                      type="text"
                      name="modelo"
                      value={bus.modelo}
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
                      Año *
                    </label>
                    <input
                      type="number"
                      name="anno"
                      value={bus.anno}
                      onChange={handleChange}
                      required
                      min="1990"
                      max={new Date().getFullYear() + 1}
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
              </div>
            </div>

            {/* Información del SOAT */}
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
                <span>📄</span> Información del SOAT
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Número de SOAT */}
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
                    Número del SOAT *
                  </label>
                  <input
                    type="text"
                    name="soat.numero"
                    value={bus.soat.numero}
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

                {/* Fecha de vencimiento */}
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
                    Fecha de Vencimiento *
                  </label>
                  <input
                    type="date"
                    name="soat.vence"
                    value={bus.soat.vence.split("T")[0]}
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

            {/* Asignación de ESP32 */}
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
                <span>🔌</span> Dispositivo ESP32
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
                  Nuevo Código ESP32 (Opcional)
                </label>
                <input
                  type="text"
                  value={codigoEsp32}
                  onChange={(e) => setCodigoEsp32(e.target.value)}
                  placeholder="Dejar vacío para mantener el actual"
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    fontFamily: "monospace",
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
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#718096",
                    marginTop: "0.5rem",
                    marginBottom: 0,
                  }}
                >
                  ℹ️ Solo ingrese un código si desea cambiar el ESP32 asignado. El sistema
                  verificará que el código exista.
                </p>
              </div>
            </div>

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
                onClick={() => navigate("/bus/buscar")}
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
        )}
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

export default FormEditBus;