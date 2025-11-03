import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getViajesByConductorUseCase,
  getViajesByBusUseCase,
  getViajesByRutaUseCase,
  listViajesUseCase,
  deleteViajeUseCase,
} from "../../../../application/viajjeUseCases";
import { IViajeResponse } from "../../../../models/IViaje";

const SuperBuscadorViajes: React.FC = () => {
  const navigate = useNavigate();
  const [criterio, setCriterio] = useState<
    "todos" | "conductor" | "bus" | "ruta"
  >("todos");
  const [valor, setValor] = useState("");
  const [viajes, setViajes] = useState<IViajeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viajeToDelete, setViajeToDelete] = useState<IViajeResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleBuscar = async () => {
    setError(null);
    setViajes([]);

    if (criterio !== "todos" && !valor.trim()) {
      setError("Por favor, ingresa un valor para buscar.");
      return;
    }

    setLoading(true);
    try {
      let data: IViajeResponse[] = [];

      switch (criterio) {
        case "todos":
          data = await listViajesUseCase();
          break;
        case "conductor":
          data = await getViajesByConductorUseCase(valor);
          break;
        case "bus":
          data = await getViajesByBusUseCase(valor);
          break;
        case "ruta":
          data = await getViajesByRutaUseCase(valor);
          break;
      }

      if (data.length === 0) {
        setError("No se encontraron viajes para ese criterio.");
      } else {
        setViajes(data);
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al buscar los viajes.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (viajeId: string) => {
    navigate(`/viaje/edit/${viajeId}`);
  };

  const handleEliminar = async () => {
    if (!viajeToDelete) return;

    setDeleting(true);
    try {
      await deleteViajeUseCase(viajeToDelete._id);
      setViajes(viajes.filter((v) => v._id !== viajeToDelete._id));
      setShowDeleteModal(false);
      setViajeToDelete(null);
    } catch (err: any) {
      console.error("Error al eliminar viaje:", err);
      setError(err.message || "No se pudo eliminar el viaje");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (viaje: IViajeResponse) => {
    setViajeToDelete(viaje);
    setShowDeleteModal(true);
  };

  const handleCrearViaje = () => {
    navigate("/viaje/create");
  };

  const getEstadoBadge = (estado: string) => {
    const estados: { [key: string]: { bg: string; color: string } } = {
      pendiente: { bg: "#feebc8", color: "#c05621" },
      "en-curso": { bg: "#bee3f8", color: "#2c5282" },
      completado: { bg: "#c6f6d5", color: "#2f855a" },
      cancelado: { bg: "#fed7d7", color: "#c53030" },
    };

    const style = estados[estado.toLowerCase()] || { bg: "#e2e8f0", color: "#4a5568" };

    return (
      <span
        style={{
          display: "inline-block",
          padding: "0.25rem 0.75rem",
          background: style.bg,
          color: style.color,
          borderRadius: "20px",
          fontSize: "0.85rem",
          fontWeight: "600",
          textTransform: "capitalize",
        }}
      >
        {estado}
      </span>
    );
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
          maxWidth: "1400px",
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
            onClick={handleCrearViaje}
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
            <span>Nuevo Viaje</span>
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
              <span style={{ fontSize: "3rem" }}>🧭</span>
            </div>
            <h1
              style={{
                fontSize: "2rem",
                color: "#2d3748",
                margin: "0 0 0.5rem 0",
                fontWeight: "700",
              }}
            >
              Super Buscador de Viajes
            </h1>
            <p style={{ color: "#718096", margin: 0 }}>
              Busca viajes por conductor, bus, ruta o lista todos
            </p>
          </div>

          {/* Controles de búsqueda */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <select
              value={criterio}
              onChange={(e) =>
                setCriterio(e.target.value as "todos" | "conductor" | "bus" | "ruta")
              }
              style={{
                flex: "1 1 300px",
                padding: "1rem 1.5rem",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s ease",
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
              <option value="todos">📋 Listar todos los viajes</option>
              <option value="conductor">👤 Buscar por DNI del Conductor</option>
              <option value="bus">🚌 Buscar por Placa del Bus</option>
              <option value="ruta">🗺️ Buscar por Nombre de Ruta</option>
            </select>

            {criterio !== "todos" && (
              <input
                type="text"
                placeholder={
                  criterio === "conductor"
                    ? "Ejemplo: 72638987"
                    : criterio === "bus"
                    ? "Ejemplo: ABC-123"
                    : "Ejemplo: Ruta Huaylas"
                }
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                style={{
                  flex: "1 1 300px",
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
            )}

            <button
              onClick={handleBuscar}
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
                animation: "slideDown 0.3s ease",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Tabla de resultados */}
        {viajes.length > 0 && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              padding: "2rem",
              overflowX: "auto",
              animation: "fadeIn 0.5s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  color: "#2d3748",
                  margin: 0,
                  fontWeight: "700",
                }}
              >
                Resultados ({viajes.length})
              </h3>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1200px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff",
                    }}
                  >
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      👤 Conductor
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      🚌 Bus
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      🗺️ Ruta
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      📍 Origen
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      🏁 Destino
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      📅 Salida
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      🕓 Llegada
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      ⚙️ Estado
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      🔧 Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {viajes.map((v, index) => (
                    <tr
                      key={v._id}
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        background: index % 2 === 0 ? "#fff" : "#f7fafc",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#edf2f7";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          index % 2 === 0 ? "#fff" : "#f7fafc";
                      }}
                    >
                      <td style={{ padding: "1rem", fontSize: "0.9rem" }}>
                        {v.conductor_id?.datos_personal
                          ? `${v.conductor_id.datos_personal.nombres} ${v.conductor_id.datos_personal.apellidos}`
                          : "N/A"}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.9rem", fontFamily: "monospace", fontWeight: "600" }}>
                        {v.bus_id?.placa || "N/A"}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.9rem" }}>
                        {v.ruta_id?.nombre || "N/A"}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.9rem" }}>
                        {v.origen || "N/A"}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.9rem" }}>
                        {v.destino || "N/A"}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.85rem" }}>
                        {v.fecha_salida
                          ? new Date(v.fecha_salida).toLocaleString("es-ES", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.85rem" }}>
                        {v.fecha_llegada
                          ? new Date(v.fecha_llegada).toLocaleString("es-ES", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {getEstadoBadge(v.estado || "pendiente")}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => handleEditar(v._id)}
                            style={{
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "#fff",
                              padding: "0.5rem 0.75rem",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                              whiteSpace: "nowrap",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(102, 126, 234, 0.5)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(102, 126, 234, 0.3)";
                            }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => openDeleteModal(v)}
                            style={{
                              background: "linear-gradient(135deg, #f56565 0%, #c53030 100%)",
                              color: "#fff",
                              padding: "0.5rem 0.75rem",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              boxShadow: "0 2px 8px rgba(245, 101, 101, 0.3)",
                              whiteSpace: "nowrap",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(245, 101, 101, 0.5)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(245, 101, 101, 0.3)";
                            }}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && viajeToDelete && (
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
                ¿Eliminar Viaje?
              </h3>
              <p style={{ color: "#718096", margin: 0, lineHeight: "1.6" }}>
                Esta acción no se puede deshacer. Se eliminará permanentemente el viaje de{" "}
                <strong>{viajeToDelete.origen}</strong> a{" "}
                <strong>{viajeToDelete.destino}</strong>.
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

export default SuperBuscadorViajes;