import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listViajesEncursousecase } from "../../../../application/viajjeUseCases";
import { IViajeResponse } from "../../../../models/IViaje";

const ViajesEnCursoList = () => {
  const [viajes, setViajes] = useState<IViajeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await listViajesEncursousecase();
        setViajes(data);
      } catch (error) {
        console.error("Error cargando viajes:", error);
        setError("Error al cargar los viajes. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVisualizar = (viajeId: string) => {
    navigate(`/viaje/visualizar/${viajeId}`);
  };

  // Estado de carga
  if (loading) {
    return (
      <div style={styles.fullScreen}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Cargando viajes en curso...</p>
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
              <span style={styles.icon}>🚌</span>
            </div>
            <div>
              <h2 style={styles.title}>Viajes en Curso</h2>
              <p style={styles.subtitle}>
                {viajes.length === 0
                  ? "No hay viajes activos en este momento"
                  : `${viajes.length} ${viajes.length === 1 ? "viaje activo" : "viajes activos"}`}
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

        {/* Lista de viajes */}
        {viajes.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🚏</div>
            <h3 style={styles.emptyTitle}>No hay viajes activos</h3>
            <p style={styles.emptyText}>
              Actualmente no hay buses en ruta. Los viajes aparecerán aquí cuando inicien.
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {viajes.map((viaje) => (
              <div key={viaje._id} style={styles.card}>
                {/* Encabezado de la tarjeta */}
                <div style={styles.cardHeader}>
                  <div style={styles.busIcon}>🚍</div>
                  <div style={styles.cardHeaderText}>
                    <h3 style={styles.cardTitle}>
                      {viaje.bus_id?.placa ?? "Sin placa"}
                    </h3>
                    <span style={styles.badge}>En curso</span>
                  </div>
                </div>

                {/* Información de la ruta */}
                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>🗺️ Ruta:</span>
                    <span style={styles.infoValue}>
                      {viaje.ruta_id?.nombre ?? "Sin ruta asignada"}
                    </span>
                  </div>

                  {viaje.bus_id?.modelo && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>🚐 Modelo:</span>
                      <span style={styles.infoValue}>{viaje.bus_id.modelo}</span>
                    </div>
                  )}
                </div>

                {/* Botón de acción */}
                <button
                  style={styles.button}
                  onClick={() => handleVisualizar(viaje._id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                  }}
                >
                  <span>📍</span>
                  <span>Ver en Tiempo Real</span>
                </button>
              </div>
            ))}
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
    maxWidth: "1200px",
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
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.5rem",
  },

  card: {
    background: "#f7fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1.5rem",
    transition: "all 0.3s ease",
    cursor: "default",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #e2e8f0",
  },

  busIcon: {
    fontSize: "2.5rem",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
  },

  cardHeaderText: {
    flex: 1,
  },

  cardTitle: {
    fontSize: "1.3rem",
    color: "#2d3748",
    margin: "0 0 0.5rem 0",
    fontWeight: "700",
    fontFamily: "monospace",
  },

  badge: {
    display: "inline-block",
    background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    color: "#fff",
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },

  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1rem",
  },

  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },

  infoLabel: {
    fontSize: "0.9rem",
    color: "#718096",
    fontWeight: "600",
    minWidth: "80px",
  },

  infoValue: {
    fontSize: "0.95rem",
    color: "#2d3748",
    fontWeight: "500",
  },

  button: {
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

export default ViajesEnCursoList;