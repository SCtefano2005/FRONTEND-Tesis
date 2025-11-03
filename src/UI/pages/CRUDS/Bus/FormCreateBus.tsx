import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBusUseCase } from "../../../../application/busUseCases";
import { getEsp32ByIdUseCase } from "../../../../application/esp32UseCases";
import { IBus } from "../../../../models/IBus";

const FormCrearBus: React.FC = () => {
  const navigate = useNavigate();
  const [bus, setBus] = useState<IBus>({
    placa: "",
    modelo: "",
    anno: new Date().getFullYear(),
    soat: {
      numero: "",
      vence: new Date().toISOString().split("T")[0],
    },
    esp32_id: "",
  });

  const [codigoEsp32, setCodigoEsp32] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "numero" || name === "vence") {
      setBus((prev) => ({
        ...prev,
        soat: {
          ...prev.soat,
          [name]: value,
        },
      }));
    } else {
      setBus((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      // 🔹 Validar si el ESP32 existe por su código
      const esp32 = await getEsp32ByIdUseCase(codigoEsp32.trim());

      if (!esp32 || !esp32._id) {
        setMensaje("❌ No se encontró ningún ESP32 con ese código.");
        setLoading(false);
        return;
      }

      // 🔹 Crear el bus con el ID real del ESP32
      const nuevoBus = {
        ...bus,
        esp32_id: esp32._id,
      };

      await createBusUseCase(nuevoBus);

      setMensaje("✅ Bus registrado correctamente");
      setBus({
        placa: "",
        modelo: "",
        anno: new Date().getFullYear(),
        soat: { numero: "", vence: new Date().toISOString().split("T")[0] },
        esp32_id: "",
      });
      setCodigoEsp32("");
    } catch (error: any) {
      setMensaje("❌ Error al registrar bus: " + error.message);
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
              Registrar Bus
            </h2>
            <p style={{ color: "#718096", margin: 0 }}>
              Complete la información del vehículo y asigne un ESP32
            </p>
          </div>
        </div>

        {/* Alertas */}
        {mensaje && (
          <div
            style={{
              background: mensaje.startsWith("✅") ? "#c6f6d5" : "#fed7d7",
              color: mensaje.startsWith("✅") ? "#2f855a" : "#c53030",
              padding: "1rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              border: mensaje.startsWith("✅") ? "1px solid #68d391" : "1px solid #fc8181",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              animation: "slideDown 0.3s ease",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>
              {mensaje.startsWith("✅") ? "✅" : "⚠️"}
            </span>
            <span>{mensaje}</span>
          </div>
        )}

        {/* Formulario */}
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
              {/* Placa */}
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
                  name="placa"
                  type="text"
                  value={bus.placa}
                  onChange={handleChange}
                  placeholder="Ej: ABC-123"
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
                    name="modelo"
                    type="text"
                    value={bus.modelo}
                    onChange={handleChange}
                    placeholder="Ej: Mercedes-Benz O500"
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
                    name="anno"
                    type="number"
                    value={bus.anno}
                    onChange={handleChange}
                    placeholder="2024"
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
                  name="numero"
                  type="text"
                  value={bus.soat.numero}
                  onChange={handleChange}
                  placeholder="Ej: SOAT-2024-123456"
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
                  name="vence"
                  type="date"
                  value={bus.soat.vence}
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
                Código del ESP32 *
              </label>
              <input
                type="text"
                value={codigoEsp32}
                onChange={(e) => setCodigoEsp32(e.target.value)}
                placeholder="Ej: ESP32-AB12CD34"
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
                ⚠️ El sistema verificará que el ESP32 exista antes de registrar el bus
              </p>
            </div>
          </div>

          {/* Botón de envío */}
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
              boxShadow: loading ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
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
            {loading ? (
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
                <span>Verificando y guardando...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Registrar Bus</span>
              </>
            )}
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

export default FormCrearBus;