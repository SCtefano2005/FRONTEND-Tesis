import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRutasUseCase, deleteRutaUseCase } from "../../../../application/rutaUseCases";
import { IRutaResponse } from "../../../../models/IRuta";

const FormBuscarRuta: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [rutas, setRutas] = useState<IRutaResponse[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rutaToDelete, setRutaToDelete] = useState<IRutaResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleBuscar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      setMensaje("🔍 Buscando rutas...");
      const todasLasRutas: IRutaResponse[] = await getAllRutasUseCase();
      const rutasFiltradas: IRutaResponse[] = nombre
        ? todasLasRutas.filter((r) =>
            r.nombre.toLowerCase().includes(nombre.toLowerCase())
          )
        : todasLasRutas;
      setRutas(rutasFiltradas);
      setMensaje(
        rutasFiltradas.length > 0
          ? `✅ Se encontraron ${rutasFiltradas.length} ruta(s)`
          : "⚠️ No se encontraron rutas con ese nombre"
      );
    } catch (error: any) {
      setMensaje("❌ Error al buscar rutas: " + error.message);
      setRutas([]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBuscar();
    }
  };

  const handleCrearRuta = () => {
    navigate("/ruta/create ");
  };

  const handleEditarRuta = (rutaId: string) => {
    navigate(`/ruta/editar/${rutaId}`);
  };

  const handleEliminarRuta = async () => {
    if (!rutaToDelete) return;

    setDeleting(true);
    try {
      await deleteRutaUseCase(rutaToDelete._id);
      setMensaje(`✅ Ruta "${rutaToDelete.nombre}" eliminada correctamente`);
      
      // Actualizar la lista de rutas
      setRutas(rutas.filter(r => r._id !== rutaToDelete._id));
      setShowDeleteModal(false);
      setRutaToDelete(null);
    } catch (error: any) {
      setMensaje("❌ Error al eliminar ruta: " + error.message);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (ruta: IRutaResponse) => {
    setRutaToDelete(ruta);
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
          maxWidth: "1200px",
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
            onClick={handleCrearRuta}
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
            <span>Nueva Ruta</span>
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
              <span style={{ fontSize: "3rem" }}>🗺️</span>
            </div>
            <h2
              style={{
                fontSize: "2rem",
                color: "#2d3748",
                margin: "0 0 0.5rem 0",
                fontWeight: "700",
              }}
            >
              Buscar Rutas
            </h2>
            <p style={{ color: "#718096", margin: 0 }}>
              Encuentre rutas por nombre o vea todas las disponibles
            </p>
          </div>

          {/* Barra de búsqueda */}
          <form onSubmit={handleBuscar}>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <input
                type="text"
                placeholder="Ingrese nombre de la ruta (opcional)"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onKeyPress={handleKeyPress}
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
                  : "#c6f6d5",
                color: mensaje.includes("❌")
                  ? "#c53030"
                  : mensaje.includes("⚠️")
                  ? "#c05621"
                  : "#2f855a",
                padding: "1rem",
                borderRadius: "12px",
                border: mensaje.includes("❌")
                  ? "1px solid #fc8181"
                  : mensaje.includes("⚠️")
                  ? "1px solid #fbd38d"
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

        {/* Resultados */}
        {rutas.length > 0 && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              padding: "2.5rem",
              animation: "fadeIn 0.5s ease",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                color: "#2d3748",
                marginBottom: "1.5rem",
                fontWeight: "700",
              }}
            >
              📍 Resultados ({rutas.length})
            </h3>

            <div
              style={{
                display: "grid",
                gap: "1.5rem",
              }}
            >
              {rutas.map((ruta) => (
                <div
                  key={ruta._id}
                  style={{
                    background: "#f7fafc",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#667eea";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Header de la ruta */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                      paddingBottom: "1rem",
                      borderBottom: "2px solid #e2e8f0",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        flex: 1,
                        minWidth: "200px",
                      }}
                    >
                      <div
                        style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "#fff",
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                          fontWeight: "700",
                        }}
                      >
                        🚌
                      </div>
                      <div>
                        <h4
                          style={{
                            fontSize: "1.25rem",
                            color: "#2d3748",
                            margin: 0,
                            fontWeight: "700",
                          }}
                        >
                          {ruta.nombre}
                        </h4>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "#718096",
                            margin: "0.25rem 0 0 0",
                          }}
                        >
                          {ruta.paraderos?.length || 0} paradero(s)
                        </p>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEditarRuta(ruta._id)}
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
                        onClick={() => openDeleteModal(ruta)}
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

                  {/* Paraderos */}
                  <div>
                    <h5
                      style={{
                        fontSize: "1rem",
                        color: "#4a5568",
                        marginBottom: "0.75rem",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>📍</span>
                      Paraderos de la Ruta
                    </h5>
                    {ruta.paraderos && ruta.paraderos.length > 0 ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                          gap: "0.75rem",
                        }}
                      >
                        {ruta.paraderos
                          .sort((a, b) => a.orden - b.orden)
                          .map((p, i) => (
                            <div
                              key={i}
                              style={{
                                background: "#fff",
                                padding: "0.75rem 1rem",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                              }}
                            >
                              <div
                                style={{
                                  background: "#667eea",
                                  color: "#fff",
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.85rem",
                                  fontWeight: "700",
                                  flexShrink: 0,
                                }}
                              >
                                {p.orden}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p
                                  style={{
                                    color: "#2d3748",
                                    fontSize: "0.9rem",
                                    margin: 0,
                                    fontWeight: "500",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                  title={p.nombre}
                                >
                                  {p.nombre}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "2rem",
                          color: "#718096",
                          fontStyle: "italic",
                        }}
                      >
                        <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>
                          📭
                        </span>
                        Sin paraderos registrados
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && rutaToDelete && (
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
                ¿Eliminar Ruta?
              </h3>
              <p style={{ color: "#718096", margin: 0, lineHeight: "1.6" }}>
                Esta acción no se puede deshacer. Se eliminará permanentemente la ruta{" "}
                <strong>"{rutaToDelete.nombre}"</strong> y todos sus paraderos asociados.
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
                onClick={handleEliminarRuta}
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

export default FormBuscarRuta;