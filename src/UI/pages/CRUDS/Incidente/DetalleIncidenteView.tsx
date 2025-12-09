import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ObtenerIncidentePorId,
  CambiarEstadoIncidente,
} from "../../../../application/incidenteUseCases";

import { IIncidenteResponse } from "../../../../models/IIncidente";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const DetalleIncidenteView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incidente, setIncidente] = useState<IIncidenteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [accionLoading, setAccionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string>("");

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;
        const data = await ObtenerIncidentePorId(id);
        setIncidente(data);
      } catch (error: any) {
        setError(error.message || "Error cargando incidente");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (!incidente) return;

    const lat = incidente.latitud;
    const lng = incidente.longitud;
    if (lat == null || lng == null) return;

    if (!mapRef.current) {
      mapRef.current = L.map("mapa-incidente").setView([lat, lng], 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);

      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    } else {
      markerRef.current?.setLatLng([lat, lng]);
      mapRef.current.setView([lat, lng]);
    }
  }, [incidente]);

  const cambiarEstado = async (nuevoEstado: string) => {
    if (!id) return;

    try {
      setAccionLoading(true);
      setMensaje("");

      await CambiarEstadoIncidente(id, nuevoEstado);

      setIncidente((prev) =>
        prev ? { ...prev, estado: nuevoEstado } : prev
      );

      setMensaje(`✅ Estado cambiado a "${nuevoEstado}" exitosamente`);
    } catch (err: any) {
      setMensaje(`❌ Error: ${err.message || "Error al cambiar el estado"}`);
    } finally {
      setAccionLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div style={styles.fullScreen}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Cargando detalles del incidente...</p>
        </div>
        <style>{spinnerAnimation}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.fullScreen}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Error al cargar incidente</h2>
          <p style={styles.errorText}>{error}</p>
          <button
            onClick={() => navigate("/incidentes")}
            style={styles.errorBtn}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#5a5ad1";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#667eea";
            }}
          >
            ← Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!incidente) {
    return (
      <div style={styles.fullScreen}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>📭</div>
          <h2 style={styles.errorTitle}>Incidente no encontrado</h2>
          <p style={styles.errorText}>No se encontró el incidente solicitado.</p>
          <button
            onClick={() => navigate("/incidentes")}
            style={styles.errorBtn}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#5a5ad1";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#667eea";
            }}
          >
            ← Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  const estadoColor = getEstadoColor(incidente.estado);

  return (
    <div style={styles.fullScreen}>
      <div style={styles.contentWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <button
            style={styles.backBtn}
            onClick={() => navigate("/incidente/todos")}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#667eea";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#667eea";
            }}
          >
            ← Volver a Incidentes
          </button>

          <div style={styles.titleSection}>
            <div style={styles.iconCircle}>
              <span style={styles.icon}>{getTipoIcon(incidente.tipo)}</span>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={styles.title}>Detalle del Incidente</h2>
              <p style={styles.subtitle}>{incidente.tipo}</p>
            </div>
            <span
              style={{
                ...styles.estadoBadge,
                background: estadoColor.bg,
                color: estadoColor.text,
                border: `2px solid ${estadoColor.border}`,
              }}
            >
              {incidente.estado}
            </span>
          </div>
        </div>

        {/* Mensaje de feedback */}
        {mensaje && (
          <div
            style={{
              ...styles.messageBox,
              background: mensaje.includes("❌") ? "#fed7d7" : "#c6f6d5",
              color: mensaje.includes("❌") ? "#c53030" : "#2f855a",
              border: mensaje.includes("❌") ? "1px solid #fc8181" : "1px solid #68d391",
            }}
          >
            <span>{mensaje}</span>
          </div>
        )}

        {/* Información del Incidente */}
        <div style={styles.infoSection}>
        <h3 style={styles.sectionTitle}>
            <span>📋</span> Información General
        </h3>

        <div style={styles.infoGrid}>

            {/* Fecha y hora */}
            <div style={styles.infoCard}>
            <span style={styles.infoLabel}>📅 Fecha y Hora</span>
            <span style={styles.infoValue}>
                {new Date(incidente.timestamp).toLocaleString("es-PE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                })}
            </span>
            </div>

            {/* Coordenadas */}
            <div style={styles.infoCard}>
            <span style={styles.infoLabel}>📍 Coordenadas</span>
            <span style={styles.infoValue}>
                {incidente.latitud && incidente.longitud ? (
                <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
                    <span><strong>Lat:</strong> {incidente.latitud.toFixed(6)}</span>
                    <span><strong>Lng:</strong> {incidente.longitud.toFixed(6)}</span>
                </div>
                ) : (
                <span style={{ color: "#c53030" }}>No registradas</span>
                )}
            </span>
            </div>

            {/* Descripción */}
            <div style={{ ...styles.infoCard, gridColumn: "1 / -1" }}>
            <span style={styles.infoLabel}>📝 Descripción</span>
            <span style={styles.infoValue}>
                {incidente.Descripcion || "Sin descripción proporcionada"}
            </span>
            </div>
        </div>
        </div>


        {/* Mapa */}
        {incidente.latitud && incidente.longitud && (
          <div style={styles.mapSection}>
            <h3 style={styles.sectionTitle}>
              <span>🗺️</span> Ubicación del Incidente
            </h3>
            <div style={styles.mapContainer}>
              <div id="mapa-incidente" style={styles.map} />
            </div>
          </div>
        )}

        {/* Información del Conductor */}
        <div style={styles.infoSection}>
          <h3 style={styles.sectionTitle}>
            <span>👤</span> Información del Conductor
          </h3>

          <div style={styles.conductorCard}>
            <div style={styles.conductorRow}>
              <span style={styles.conductorLabel}>Nombre Completo:</span>
              <span style={styles.conductorValue}>
                {incidente.UsuarioConductorID.datos_personal.nombres}{" "}
                {incidente.UsuarioConductorID.datos_personal.apellidos}
              </span>
            </div>

            <div style={styles.conductorRow}>
              <span style={styles.conductorLabel}>DNI:</span>
              <span style={styles.conductorValue}>
                {incidente.UsuarioConductorID.identificacion}
              </span>
            </div>

            <div style={styles.conductorRow}>
              <span style={styles.conductorLabel}>Teléfono:</span>
              <span style={styles.conductorValue}>
                {incidente.UsuarioConductorID.datos_personal.telefono}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div style={styles.actionsSection}>
          <h3 style={styles.sectionTitle}>
            <span>⚡</span> Acciones Disponibles
          </h3>

          <div style={styles.actionsButtons}>
            {incidente.estado === "Pendiente" && (
              <button
                disabled={accionLoading}
                onClick={() => cambiarEstado("Revisado")}
                style={{
                  ...styles.actionBtn,
                  ...styles.actionBtnRevisar,
                  opacity: accionLoading ? 0.6 : 1,
                  cursor: accionLoading ? "not-allowed" : "pointer",
                }}
                onMouseOver={(e) => {
                  if (!accionLoading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(249, 168, 37, 0.6)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!accionLoading) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(249, 168, 37, 0.4)";
                  }
                }}
              >
                {accionLoading ? (
                  <>
                    <div style={styles.btnSpinner} />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span>👁️</span>
                    <span>Marcar como Revisado</span>
                  </>
                )}
              </button>
            )}

            {incidente.estado === "Revisado" && (
              <button
                disabled={accionLoading}
                onClick={() => cambiarEstado("Solucionado")}
                style={{
                  ...styles.actionBtn,
                  ...styles.actionBtnSolucionar,
                  opacity: accionLoading ? 0.6 : 1,
                  cursor: accionLoading ? "not-allowed" : "pointer",
                }}
                onMouseOver={(e) => {
                  if (!accionLoading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(72, 187, 120, 0.6)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!accionLoading) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(72, 187, 120, 0.4)";
                  }
                }}
              >
                {accionLoading ? (
                  <>
                    <div style={styles.btnSpinner} />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span>✅</span>
                    <span>Marcar como Solucionado</span>
                  </>
                )}
              </button>
            )}

            {incidente.estado === "Solucionado" && (
              <div style={styles.completedMessage}>
                <span style={styles.completedIcon}>✅</span>
                <div>
                  <h4 style={styles.completedTitle}>Incidente Resuelto</h4>
                  <p style={styles.completedText}>
                    Este incidente ha sido marcado como solucionado. No hay acciones pendientes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
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
    maxWidth: "1100px",
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

  estadoBadge: {
    padding: "0.6rem 1.2rem",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  messageBox: {
    padding: "1rem",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    animation: "slideDown 0.3s ease",
  },

  infoSection: {
    background: "#f7fafc",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    marginBottom: "1.5rem",
  },

  sectionTitle: {
    fontSize: "1.1rem",
    color: "#4a5568",
    marginBottom: "1.25rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    margin: "0 0 1.25rem 0",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
  },

  infoCard: {
    background: "#ffffff",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  infoLabel: {
    fontSize: "0.8rem",
    color: "#718096",
    fontWeight: "600",
    textTransform: "uppercase",
  },

  infoValue: {
    fontSize: "1rem",
    color: "#2d3748",
    fontWeight: "600",
    fontFamily: "monospace",
  },

  mapSection: {
    background: "#f7fafc",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    marginBottom: "1.5rem",
  },

  mapContainer: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },

  map: {
    height: "400px",
    width: "100%",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },

  conductorCard: {
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  conductorRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem",
    background: "#f7fafc",
    borderRadius: "6px",
  },

  conductorLabel: {
    fontSize: "0.9rem",
    color: "#718096",
    fontWeight: "600",
  },

  conductorValue: {
    fontSize: "1rem",
    color: "#2d3748",
    fontWeight: "600",
  },

  actionsSection: {
    background: "#f7fafc",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
  },

  actionsButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  actionBtn: {
    width: "100%",
    padding: "1rem",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
  },

  actionBtnRevisar: {
    background: "linear-gradient(135deg, #f9a825 0%, #f57c00 100%)",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(249, 168, 37, 0.4)",
  },

  actionBtnSolucionar: {
    background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(72, 187, 120, 0.4)",
  },

  btnSpinner: {
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  completedMessage: {
    background: "#c6f6d5",
    border: "2px solid #68d391",
    borderRadius: "12px",
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  completedIcon: {
    fontSize: "3rem",
  },

  completedTitle: {
    fontSize: "1.2rem",
    color: "#2f855a",
    margin: "0 0 0.5rem 0",
    fontWeight: "700",
  },

  completedText: {
    fontSize: "0.95rem",
    color: "#276749",
    margin: 0,
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

  errorCard: {
    background: "#fff",
    padding: "3rem",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    maxWidth: "500px",
  },

  errorIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },

  errorTitle: {
    fontSize: "1.5rem",
    color: "#c53030",
    margin: "0 0 1rem 0",
    fontWeight: "700",
  },

  errorText: {
    color: "#4a5568",
    marginBottom: "2rem",
  },

  errorBtn: {
    background: "#667eea",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
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
    to { transform: rotate(360deg); }
  }
`;

export default DetalleIncidenteView;