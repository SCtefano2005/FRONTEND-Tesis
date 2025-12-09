import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ObtenerListaIncidentes } from "../../../../application/incidenteUseCases";
import { IIncidente } from "../../../../models/IIncidente";

type EstadoFiltro = "Todos" | "Pendiente" | "Revisado" | "Solucionado";

const ListaIncidentesView: React.FC = () => {
  const [incidentes, setIncidentes] = useState<IIncidente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<EstadoFiltro>("Todos");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarIncidentes = async () => {
      try {
        setLoading(true);
        const data = await ObtenerListaIncidentes();
        setIncidentes(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar incidentes");
      } finally {
        setLoading(false);
      }
    };
    cargarIncidentes();
  }, []);

  // Filtrar incidentes según el estado seleccionado
  const incidentesFiltrados = incidentes.filter((inc) => {
    if (filtroEstado === "Todos") return true;
    return inc.estado === filtroEstado;
  });

  // Contar incidentes por estado
  const contadores = {
    Todos: incidentes.length,
    Pendiente: incidentes.filter((inc) => inc.estado === "Pendiente").length,
    Revisado: incidentes.filter((inc) => inc.estado === "Revisado").length,
    Solucionado: incidentes.filter((inc) => inc.estado === "Solucionado").length,
  };

  // Obtener color según estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return { bg: "#fed7d7", text: "#c53030", border: "#fc8181" };
      case "Revisado":
        return { bg: "#feebc8", text: "#c05621", border: "#f6ad55" };
      case "Solucionado":
        return { bg: "#c6f6d5", text: "#2f855a", border: "#68d391" };
      default:
        return { bg: "#e2e8f0", text: "#4a5568", border: "#cbd5e0" };
    }
  };

  // Obtener icono según tipo
  const getTipoIcon = (tipo: string) => {
    const tipos: Record<string, string> = {
      "Accidente": "🚨",
      "Falla mecánica": "⚙️",
      "Emergencia médica": "🏥",
      "Problema de ruta": "🗺️",
      "Otros": "⚠️",
    };
    return tipos[tipo] || "📌";
  };

  // Estado de carga
  if (loading) {
    return (
      <div style={styles.fullScreen}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Cargando incidentes...</p>
        </div>
        <style>{spinnerAnimation}</style>
      </div>
    );
  }

  return (
    <div style={styles.fullScreen}>
      <div style={styles.contentWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <button
            style={styles.backBtn}
            onClick={() => navigate("/dashboard")}
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

          <div style={styles.titleSection}>
            <div style={styles.iconCircle}>
              <span style={styles.icon}>📋</span>
            </div>
            <div>
              <h2 style={styles.title}>Gestión de Incidentes</h2>
              <p style={styles.subtitle}>
                {incidentes.length === 0
                  ? "No hay incidentes registrados"
                  : `${incidentes.length} ${incidentes.length === 1 ? "incidente registrado" : "incidentes registrados"}`}
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Filtros */}
        <div style={styles.filterSection}>
          <h3 style={styles.filterTitle}>Filtrar por estado:</h3>
          <div style={styles.filterButtons}>
            {(["Todos", "Pendiente", "Revisado", "Solucionado"] as EstadoFiltro[]).map((estado) => (
              <button
                key={estado}
                style={{
                  ...styles.filterBtn,
                  ...(filtroEstado === estado ? styles.filterBtnActive : {}),
                }}
                onClick={() => setFiltroEstado(estado)}
                onMouseOver={(e) => {
                  if (filtroEstado !== estado) {
                    e.currentTarget.style.background = "#f7fafc";
                    e.currentTarget.style.borderColor = "#cbd5e0";
                  }
                }}
                onMouseOut={(e) => {
                  if (filtroEstado !== estado) {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }
                }}
              >
                <span>{estado}</span>
                <span style={styles.filterCount}>{contadores[estado]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lista de incidentes */}
        {incidentesFiltrados.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h3 style={styles.emptyTitle}>
              {filtroEstado === "Todos"
                ? "No hay incidentes registrados"
                : `No hay incidentes en estado "${filtroEstado}"`}
            </h3>
            <p style={styles.emptyText}>
              {filtroEstado !== "Todos" && "Prueba seleccionando otro filtro."}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {incidentesFiltrados.map((inc) => {
              const estadoColor = getEstadoColor(inc.estado);
              return (
                <div key={inc._id} style={styles.card}>
                  {/* Header de la tarjeta */}
                  <div style={styles.cardHeader}>
                    <div style={styles.tipoSection}>
                      <span style={styles.tipoIcon}>{getTipoIcon(inc.tipo)}</span>
                      <h3 style={styles.cardTitle}>{inc.tipo}</h3>
                    </div>
                    <span
                      style={{
                        ...styles.estadoBadge,
                        background: estadoColor.bg,
                        color: estadoColor.text,
                        border: `2px solid ${estadoColor.border}`,
                      }}
                    >
                      {inc.estado}
                    </span>
                  </div>

                  {/* Información del incidente */}
                  <div style={styles.cardBody}>
                    {/* Ubicación */}
                    <div style={styles.infoRow}>
                      <span style={styles.infoIcon}>📍</span>
                      <div style={styles.infoContent}>
                        <span style={styles.infoLabel}>Ubicación:</span>
                        <span style={styles.infoValue}>
                          {inc.ubicacion.lat.toFixed(6)}, {inc.ubicacion.lng.toFixed(6)}
                        </span>
                      </div>
                    </div>

                    {/* Conductor */}
                    <div style={styles.infoRow}>
                      <span style={styles.infoIcon}>👤</span>
                      <div style={styles.infoContent}>
                        <span style={styles.infoLabel}>Conductor:</span>
                        <span style={styles.infoValue}>
                          {inc.UsuarioConductorId.nombreyapellido}
                        </span>
                      </div>
                    </div>

                    {/* Identificación */}
                    <div style={styles.infoRow}>
                      <span style={styles.infoIcon}>🆔</span>
                      <div style={styles.infoContent}>
                        <span style={styles.infoLabel}>Identificación:</span>
                        <span style={styles.infoValue}>
                          {inc.UsuarioConductorId.identificacion}
                        </span>
                      </div>
                    </div>

                    {/* Teléfono */}
                    <div style={styles.infoRow}>
                      <span style={styles.infoIcon}>📞</span>
                      <div style={styles.infoContent}>
                        <span style={styles.infoLabel}>Teléfono:</span>
                        <span style={styles.infoValue}>
                          {inc.UsuarioConductorId.telefono}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Botón de acción */}
                  <button
                    style={styles.detailBtn}
                    onClick={() => navigate(`/incidentes/${inc._id}`)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                    }}
                  >
                    <span>🔍</span>
                    <span>Ver Detalles Completos</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{animations}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  fullScreen: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  contentWrapper: {
    maxWidth: "1400px",
    width: "100%",
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    padding: "2.5rem",
  },

  header: {
    marginBottom: "2rem",
  },

  backBtn: {
    background: "transparent",
    border: "2px solid #667eea",
    color: "#667eea",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    transition: "all 0.3s ease",
  },

  titleSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  iconCircle: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    width: "70px",
    height: "70px",
    flexShrink: 0,
  },

  icon: {
    fontSize: "2.5rem",
  },

  title: {
    fontSize: "2rem",
    color: "#2d3748",
    margin: "0 0 0.25rem 0",
    fontWeight: "700",
  },

  subtitle: {
    color: "#718096",
    margin: 0,
    fontSize: "0.95rem",
  },

  errorBox: {
    background: "#fed7d7",
    color: "#c53030",
    padding: "1rem",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    border: "1px solid #fc8181",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },

  errorIcon: {
    fontSize: "1.2rem",
  },

  filterSection: {
    background: "#f7fafc",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    marginBottom: "2rem",
  },

  filterTitle: {
    fontSize: "1.1rem",
    color: "#4a5568",
    margin: "0 0 1rem 0",
    fontWeight: "600",
  },

  filterButtons: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },

  filterBtn: {
    background: "#fff",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    padding: "0.75rem 1.25rem",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#4a5568",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },

  filterBtnActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    borderColor: "transparent",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },

  filterCount: {
    background: "rgba(255, 255, 255, 0.3)",
    padding: "0.2rem 0.6rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "700",
  },

  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
  },

  emptyIcon: {
    fontSize: "5rem",
    marginBottom: "1rem",
    opacity: 0.5,
  },

  emptyTitle: {
    fontSize: "1.5rem",
    color: "#2d3748",
    margin: "0 0 0.5rem 0",
    fontWeight: "600",
  },

  emptyText: {
    color: "#718096",
    fontSize: "1rem",
    margin: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "1.5rem",
  },

  card: {
    background: "#f7fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1.5rem",
    transition: "all 0.3s ease",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #e2e8f0",
  },

  tipoSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },

  tipoIcon: {
    fontSize: "2rem",
  },

  cardTitle: {
    fontSize: "1.2rem",
    color: "#2d3748",
    margin: 0,
    fontWeight: "700",
  },

  estadoBadge: {
    padding: "0.4rem 0.9rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1.25rem",
  },

  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    background: "#fff",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },

  infoIcon: {
    fontSize: "1.2rem",
    marginTop: "0.1rem",
  },

  infoContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },

  infoLabel: {
    fontSize: "0.8rem",
    color: "#718096",
    fontWeight: "600",
    textTransform: "uppercase",
  },

  infoValue: {
    fontSize: "0.95rem",
    color: "#2d3748",
    fontWeight: "500",
  },

  detailBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    padding: "0.875rem",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },

  loadingCard: {
    background: "#fff",
    padding: "3rem",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },

  spinner: {
    width: "60px",
    height: "60px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    margin: "0 auto 1rem",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    color: "#4a5568",
    fontSize: "1.1rem",
    margin: 0,
  },
};

const spinnerAnimation = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const animations = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default ListaIncidentesView;