import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEsp32UseCase } from "../../../../application/esp32UseCases";
import { IEsp32Create } from "../../../../models/IEsp32";

const FormCrearEsp32: React.FC = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);
    setLoading(true);

    const data: IEsp32Create = {
      codigo,
      descripcion,
      activo,
    };

    try {
      const response = await createEsp32UseCase(data);
      console.log("✅ ESP32 creado:", response);
      setMensaje(`ESP32 "${response.codigo}" creado con éxito`);
      setCodigo("");
      setDescripcion("");
      setActivo(true);
    } catch (err: any) {
      console.error("❌ Error al crear ESP32:", err);
      setError(err.message || "Error al crear el ESP32");
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
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          padding: "2.5rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/esp32/searchbycode")}
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
              <span style={{ fontSize: "3rem" }}>🔌</span>
            </div>
            <h2
              style={{
                fontSize: "2rem",
                color: "#2d3748",
                margin: "0 0 0.5rem 0",
                fontWeight: "700",
              }}
            >
              Registrar ESP32
            </h2>
            <p style={{ color: "#718096", margin: 0 }}>
              Configure un nuevo dispositivo ESP32 para el sistema
            </p>
          </div>
        </div>

        {/* Alertas */}
        {mensaje && (
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
            <span>{mensaje}</span>
          </div>
        )}
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

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Información del Dispositivo */}
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
              <span>📡</span> Información del Dispositivo
            </h3>

            {/* Código del ESP32 */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#4a5568",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Código (único) *
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                placeholder="Ej: ESP32-AB12CD34"
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
                Este código debe ser único en el sistema
              </p>
            </div>

            {/* Descripción */}
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
                Descripción
              </label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: ESP32 asignado al Bus 1"
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
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#718096",
                  marginTop: "0.5rem",
                  marginBottom: 0,
                }}
              >
                Opcional: Agregue una descripción para identificar mejor el dispositivo
              </p>
            </div>
          </div>

          {/* Estado del Dispositivo */}
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
              <span>⚙️</span> Configuración
            </h3>

            {/* Checkbox Activo */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
                padding: "0.75rem",
                background: "#fff",
                borderRadius: "8px",
                border: "2px solid #e2e8f0",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#667eea";
                e.currentTarget.style.background = "#f8f9ff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "#fff";
              }}
            >
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  accentColor: "#667eea",
                }}
              />
              <div>
                <span
                  style={{
                    color: "#2d3748",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    display: "block",
                  }}
                >
                  Dispositivo Activo
                </span>
                <span
                  style={{
                    color: "#718096",
                    fontSize: "0.8rem",
                    display: "block",
                    marginTop: "0.25rem",
                  }}
                >
                  El ESP32 estará disponible para recibir datos de los buses
                </span>
              </div>
            </label>
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
                <span>Creando...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Crear ESP32</span>
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

export default FormCrearEsp32;