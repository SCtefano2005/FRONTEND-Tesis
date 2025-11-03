import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEsp32ByIdUseCase,
  deleteEsp32UseCase,
} from "../../../../application/esp32UseCases";
import { IEsp32Response } from "../../../../models/IEsp32";

const FormSearchbyCodigo: React.FC = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [esp32, setEsp32] = useState<IEsp32Response | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodigo(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setEsp32(null);

    if (!codigo.trim()) {
      setError("⚠️ Ingresa un código de ESP32");
      return;
    }

    try {
      setLoading(true);
      const data = await getEsp32ByIdUseCase(codigo.trim());
      setEsp32(data);
    } catch (err: any) {
      console.error("❌ Error al buscar ESP32:", err);
      setError(err.response?.data?.message || "ESP32 no encontrado o sin permisos");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && codigo) {
      handleSubmit(e as any);
    }
  };

  const handleDelete = async () => {
    if (!esp32) return;

    try {
      setDeleting(true);
      await deleteEsp32UseCase(esp32._id);
      setSuccessMsg("✅ ESP32 eliminado correctamente.");
      setEsp32(null);
      setCodigo("");
      setShowDeleteModal(false);
    } catch (err: any) {
      console.error("❌ Error al eliminar ESP32:", err);
      setError(err.response?.data?.message || "No se pudo eliminar el ESP32");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    if (esp32) {
      navigate(`/esp32/editar/${esp32._id}/${esp32.codigo}`);
    }
  };

  const handleCrearEsp32 = () => {
    navigate("/esp32/create");
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
          maxWidth: "800px",
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
            onClick={handleCrearEsp32}
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
            <span>Nuevo ESP32</span>
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
              <span style={{ fontSize: "3rem" }}>🔍</span>
            </div>
            <h2
              style={{
                fontSize: "2rem",
                color: "#2d3748",
                margin: "0 0 0.5rem 0",
                fontWeight: "700",
              }}
            >
              Buscar ESP32 por Código
            </h2>
            <p style={{ color: "#718096", margin: 0 }}>
              Ingrese el código del dispositivo para ver su información
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
                placeholder="Ejemplo: ESP32-AB12CD34"
                value={codigo}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                style={{
                  flex: 1,
                  padding: "1rem 1.5rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease",
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
              <button
                type="submit"
                disabled={loading || !codigo}
                style={{
                  background:
                    loading || !codigo
                      ? "#cbd5e0"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  padding: "1rem 2rem",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: loading || !codigo ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow:
                    loading || !codigo ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
                  whiteSpace: "nowrap",
                }}
                onMouseOver={(e) => {
                  if (!loading && codigo) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading && codigo) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                  }
                }}
              >
                {loading ? "🔄 Buscando..." : "🔍 Buscar"}
              </button>
            </div>
          </form>

          {/* Mensajes de estado */}
          {error && (
            <div
              style={{
                background: "#fed7d7",
                color: "#c53030",
                padding: "1rem",
                borderRadius: "12px",
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
          {successMsg && (
            <div
              style={{
                background: "#c6f6d5",
                color: "#2f855a",
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid #68d391",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                animation: "slideDown 0.3s ease",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>✅</span>
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Card de resultados */}
        {esp32 && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              padding: "2.5rem",
              animation: "fadeIn 0.5s ease",
            }}
          >
            {/* Header del ESP32 */}
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
                  🔌
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.75rem",
                      color: "#2d3748",
                      margin: "0 0 0.25rem 0",
                      fontWeight: "700",
                      fontFamily: "monospace",
                    }}
                  >
                    {esp32.codigo}
                  </h3>
                  <p style={{ color: "#718096", margin: 0, fontSize: "0.95rem" }}>
                    {esp32.descripcion || "Sin descripción"}
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={handleEdit}
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
                  onClick={() => setShowDeleteModal(true)}
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

            {/* Información del ESP32 */}
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
                <span>📡</span> Detalles del Dispositivo
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                    {esp32.descripcion || "Sin descripción"}
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
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && esp32 && (
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
                ¿Eliminar ESP32?
              </h3>
              <p style={{ color: "#718096", margin: 0, lineHeight: "1.6" }}>
                Esta acción no se puede deshacer. Se eliminará permanentemente el dispositivo{" "}
                <strong>{esp32.codigo}</strong> del sistema.
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
                onClick={handleDelete}
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

export default FormSearchbyCodigo;