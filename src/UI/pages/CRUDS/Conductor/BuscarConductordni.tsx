// src/ui/pages/BuscarConductor.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarConductorPorDniUseCase, eliminarConductorUseCase } from "../../../../application/conductorUseCases";
import { IConductorResponse } from "../../../../models/IConductorResponse";

const BuscarConductor: React.FC = () => {
  const [dni, setDni] = useState("");
  const [conductorData, setConductorData] = useState<IConductorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleBuscar = async () => {
    setError(null);
    setConductorData(null);
    setLoading(true);

    try {
      // 👇 Agrega el prefijo "DNI-" solo si no está presente
      const dniFormateado = dni.startsWith("DNI-") ? dni : `DNI-${dni}`;

      const data = await buscarConductorPorDniUseCase(dniFormateado);
      console.log("✅ Conductor encontrado:", data);
      setConductorData(data);
    } catch (err: any) {
      console.error("❌ Error en handleBuscar:", err);
      setError(err.message || "No se pudo buscar el conductor");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = () => {
    if (conductorData) {
      navigate(`/conductor/editar/${conductorData.usuario.identificacion}`);
    }
  };

  const handleEliminar = async () => {
    if (!conductorData) return;
    
    setDeleting(true);
    setError(null);

    try {
      await eliminarConductorUseCase(conductorData.usuario.identificacion);
      console.log("✅ Conductor eliminado correctamente");
      
      // Limpiar datos y cerrar modal
      setConductorData(null);
      setShowDeleteModal(false);
      setDni("");
      
      // Mostrar mensaje de éxito (opcional)
      alert("✅ Conductor eliminado correctamente");
    } catch (err: any) {
      console.error("❌ Error al eliminar conductor:", err);
      setError(err.message || "No se pudo eliminar el conductor");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && dni) {
      handleBuscar();
    }
  };

  const handleCrearConductor = () => {
    navigate("/conductor/crear-conductor");
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
            onClick={handleCrearConductor}
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
            <span>Nuevo Conductor</span>
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
            <h2
              style={{
                fontSize: "2rem",
                color: "#2d3748",
                margin: "0 0 0.5rem 0",
                fontWeight: "700",
              }}
            >
              🔍 Buscar Conductor
            </h2>
            <p style={{ color: "#718096", margin: 0 }}>
              Ingrese el DNI del conductor para ver su información
            </p>
          </div>

          {/* Barra de búsqueda */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ingrese DNI (ej: 12345678)"
              style={{
                flex: 1,
                padding: "1rem 1.5rem",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s ease",
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
              onClick={handleBuscar}
              disabled={loading || !dni}
              style={{
                background:
                  loading || !dni
                    ? "#cbd5e0"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                padding: "1rem 2rem",
                border: "none",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: loading || !dni ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow:
                  loading || !dni ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => {
                if (!loading && dni) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading && dni) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                }
              }}
            >
              {loading ? "🔄 Buscando..." : "🔍 Buscar"}
            </button>
          </div>

          {/* Mensaje de error */}
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
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Card de resultados */}
        {conductorData && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              padding: "2.5rem",
              animation: "fadeIn 0.5s ease",
            }}
          >
            {/* Header del conductor */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
                paddingBottom: "1.5rem",
                borderBottom: "2px solid #e2e8f0",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.75rem",
                    color: "#2d3748",
                    margin: "0 0 0.5rem 0",
                    fontWeight: "700",
                  }}
                >
                  {conductorData.usuario.datos_personal.nombres}{" "}
                  {conductorData.usuario.datos_personal.apellidos}
                </h3>
                <p style={{ color: "#718096", margin: 0, fontSize: "0.95rem" }}>
                  DNI: {conductorData.usuario.identificacion}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={handleEditar}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    padding: "0.75rem 1.5rem",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  style={{
                    background: "linear-gradient(135deg, #f56565 0%, #c53030 100%)",
                    color: "#fff",
                    padding: "0.75rem 1.5rem",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(245, 101, 101, 0.4)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(245, 101, 101, 0.6)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(245, 101, 101, 0.4)";
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            {/* Información personal */}
            <div style={{ marginBottom: "2rem" }}>
              <h4
                style={{
                  fontSize: "1.25rem",
                  color: "#4a5568",
                  marginBottom: "1rem",
                  fontWeight: "600",
                }}
              >
                📋 Información Personal
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                  background: "#f7fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "#718096",
                      fontSize: "0.85rem",
                      margin: "0 0 0.25rem 0",
                      fontWeight: "500",
                    }}
                  >
                    Email
                  </p>
                  <p
                    style={{
                      color: "#2d3748",
                      fontSize: "1rem",
                      margin: 0,
                      fontWeight: "500",
                    }}
                  >
                    {conductorData.usuario.datos_personal.email}
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
                    Teléfono
                  </p>
                  <p
                    style={{
                      color: "#2d3748",
                      fontSize: "1rem",
                      margin: 0,
                      fontWeight: "500",
                    }}
                  >
                    {conductorData.usuario.datos_personal.telefono}
                  </p>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <p
                    style={{
                      color: "#718096",
                      fontSize: "0.85rem",
                      margin: "0 0 0.25rem 0",
                      fontWeight: "500",
                    }}
                  >
                    Dirección
                  </p>
                  <p
                    style={{
                      color: "#2d3748",
                      fontSize: "1rem",
                      margin: 0,
                      fontWeight: "500",
                    }}
                  >
                    {conductorData.usuario.datos_personal.direccion}
                  </p>
                </div>
              </div>
            </div>

            {/* Información de licencia */}
            <div style={{ marginBottom: "2rem" }}>
              <h4
                style={{
                  fontSize: "1.25rem",
                  color: "#4a5568",
                  marginBottom: "1rem",
                  fontWeight: "600",
                }}
              >
                🪪 Licencia de Conducir
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  background: "#f7fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                }}
              >
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
                    {conductorData.conductor.numero_licencia}
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
                    Categoría
                  </p>
                  <p
                    style={{
                      color: "#2d3748",
                      fontSize: "1rem",
                      margin: 0,
                      fontWeight: "600",
                    }}
                  >
                    {conductorData.conductor.categoria_lic}
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
                      background:
                        conductorData.conductor.estado_conduct === "activo"
                          ? "#c6f6d5"
                          : "#fed7d7",
                      color:
                        conductorData.conductor.estado_conduct === "activo"
                          ? "#2f855a"
                          : "#c53030",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    {conductorData.conductor.estado_conduct.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Documentos */}
            {conductorData.conductor.documentos.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h4
                  style={{
                    fontSize: "1.25rem",
                    color: "#4a5568",
                    marginBottom: "1rem",
                    fontWeight: "600",
                  }}
                >
                  📄 Documentos
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {conductorData.conductor.documentos.map((doc, index) => (
                    <div
                      key={doc.url || index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#f7fafc",
                        padding: "1rem 1.5rem",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            color: "#2d3748",
                            fontSize: "1rem",
                            margin: "0 0 0.25rem 0",
                            fontWeight: "600",
                          }}
                        >
                          {doc.nombre}
                        </p>
                        <p style={{ color: "#718096", fontSize: "0.85rem", margin: 0 }}>
                          Vence: {new Date(doc.vence).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: "#667eea",
                          color: "#fff",
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          textDecoration: "none",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#5568d3";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#667eea";
                        }}
                      >
                        Ver documento
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experiencia */}
            <div>
              <h4
                style={{
                  fontSize: "1.25rem",
                  color: "#4a5568",
                  marginBottom: "1rem",
                  fontWeight: "600",
                }}
              >
                🎯 Experiencia
              </h4>
              <div
                style={{
                  background: "#f7fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <p
                    style={{
                      color: "#718096",
                      fontSize: "0.85rem",
                      margin: "0 0 0.25rem 0",
                      fontWeight: "500",
                    }}
                  >
                    Años de experiencia
                  </p>
                  <p
                    style={{
                      color: "#2d3748",
                      fontSize: "1.5rem",
                      margin: 0,
                      fontWeight: "700",
                    }}
                  >
                    {conductorData.conductor.experiencia.anios} años
                  </p>
                </div>
                {conductorData.conductor.experiencia.historial.length > 0 && (
                  <div>
                    <p
                      style={{
                        color: "#718096",
                        fontSize: "0.85rem",
                        margin: "0 0 0.5rem 0",
                        fontWeight: "500",
                      }}
                    >
                      Historial
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {conductorData.conductor.experiencia.historial.map((item, index) => (
                        <span
                          key={index}
                          style={{
                            background: "#fff",
                            color: "#667eea",
                            padding: "0.5rem 1rem",
                            borderRadius: "20px",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
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
                ¿Eliminar Conductor?
              </h3>
              <p style={{ color: "#718096", margin: 0, lineHeight: "1.6" }}>
                Esta acción no se puede deshacer. Se eliminará permanentemente el conductor{" "}
                <strong>{conductorData?.usuario.datos_personal.nombres} {conductorData?.usuario.datos_personal.apellidos}</strong>{" "}
                (DNI: {conductorData?.usuario.identificacion}).
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
                onClick={handleEliminar}
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

export default BuscarConductor;