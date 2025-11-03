import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEsp32ByIdUseCase, updateEsp32UseCase } from "../../../../application/esp32UseCases";
import { IEsp32Create, IEsp32Response } from "../../../../models/IEsp32";

const FormEditEsp32: React.FC = () => {
  const { id, codigo } = useParams<{ id: string; codigo: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<IEsp32Create>({
    codigo: "",
    descripcion: "",
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Cargar datos usando el código del ESP32
  useEffect(() => {
    const fetchEsp32 = async () => {
      if (!codigo) return;
      setLoading(true);
      setError("");
      try {
        const data: IEsp32Response = await getEsp32ByIdUseCase(codigo);
        setFormData({
          codigo: data.codigo,
          descripcion: data.descripcion || "",
          activo: data.activo,
        });
        setSuccess("✅ ESP32 cargado correctamente");
      } catch (err: any) {
        console.error("❌ Error al cargar ESP32:", err);
        setError(err.response?.data?.message || "Error al obtener los datos del ESP32");
      } finally {
        setLoading(false);
      }
    };

    fetchEsp32();
  }, [codigo]);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // 🔹 Enviar datos usando el ID
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError("❌ No se encontró el ID del ESP32.");
      return;
    }

    setError("");
    setSuccess("");
    setUpdating(true);

    try {
      await updateEsp32UseCase(id, formData);
      setSuccess("✅ ESP32 actualizado correctamente.");
      setTimeout(() => navigate("/esp32/searchbycode"), 1500);
    } catch (err: any) {
      console.error("❌ Error al actualizar ESP32:", err);
      setError(err.response?.data?.message || "No se pudo actualizar el ESP32");
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
            Cargando información del ESP32...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  // 🔹 Error: ESP32 no encontrado
  if (!loading && error && !formData.codigo) {
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
            ESP32 no encontrado
          </h2>
          <p style={{ color: "#4a5568", marginBottom: "2rem" }}>
            No se pudo encontrar el dispositivo ESP32 especificado.
          </p>
          <button
            onClick={() => navigate("/esp32/buscar")}
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
            Volver a Buscar ESP32
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
              Editar ESP32
            </h2>
            <p style={{ color: "#718096", margin: 0 }}>
              Modifique la información del dispositivo
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
              <span>🔌</span> Información del Dispositivo
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Código (deshabilitado) */}
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
                  Código del ESP32
                </label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  required
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
                    fontFamily: "monospace",
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
                  El código no puede ser modificado
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
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Ejemplo: Módulo de acceso 1"
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
                  Ingrese una descripción para identificar el dispositivo
                </p>
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
                  Estado del Dispositivo
                </label>
                <select
                  name="activo"
                  value={formData.activo ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      activo: e.target.value === "true",
                    }))
                  }
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
                  <option value="true">✅ Activo</option>
                  <option value="false">❌ Inactivo</option>
                </select>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#718096",
                    marginTop: "0.5rem",
                    marginBottom: 0,
                  }}
                >
                  Define si el dispositivo está operativo
                </p>
              </div>
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
              onClick={() => navigate("/esp32/buscar")}
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

export default FormEditEsp32;