import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  connectSocketToViaje,
  onCoordenada,
  offCoordenada,
  disconnectSocket
} from "../../../../infra/socketViaje";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const parseFechaLocalEsPE = (valor: string): Date | null => {
  try {
    // Ejemplo: "10/12/2025, 4:18:31 a. m."
    const [fechaParte, horaParteRaw] = valor.split(",");
    if (!fechaParte || !horaParteRaw) return null;

    const [diaStr, mesStr, anioStr] = fechaParte.trim().split("/");
    const [horaStr, minutoStr, segundoStr, sufijo1, sufijo2] = horaParteRaw
      .trim()
      .split(/[:\s]+/);

    const dia = Number(diaStr);
    const mes = Number(mesStr) - 1; // Mes 0-11
    const anio = Number(anioStr);
    let hora = Number(horaStr);
    const minuto = Number(minutoStr);
    const segundo = Number(segundoStr);

    const sufijo = `${sufijo1} ${sufijo2}`.toLowerCase(); // "a. m." o "p. m."

    if (
      [dia, mes, anio, hora, minuto, segundo].some((n) => Number.isNaN(n))
    ) {
      return null;
    }

    // Convertir a formato 24h
    if (sufijo.includes("p.") && hora < 12) {
      hora += 12;
    }
    if (sufijo.includes("a.") && hora === 12) {
      hora = 0;
    }

    return new Date(anio, mes, dia, hora, minuto, segundo);
  } catch {
    return null;
  }
};

const Viewviaje = () => {
  const { id_viaje } = useParams<{ id_viaje: string }>();
  const navigate = useNavigate();

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [coord, setCoord] = useState<any>(null);
  const [hora, setHora] = useState<string>("—");

  const formatHora = (timestamp?: string) => {
    console.log("🟦 formatHora() recibió:", timestamp);

    if (!timestamp) return "—";

    let fecha = new Date(timestamp);

    if (isNaN(fecha.getTime()) && timestamp.includes("/")) {
      console.log("🔁 Intentando parsear formato local ES-PE:", timestamp);
      const parseada = parseFechaLocalEsPE(timestamp);
      if (parseada) {
        fecha = parseada;
      }
    }

    console.log("🟪 Fecha final en formatHora:", fecha);

    if (isNaN(fecha.getTime())) {
      console.log("❌ Fecha inválida incluso tras parsear");
      return "—";
    }

    const h = fecha.toLocaleTimeString("es-PE", { hour12: false });
    console.log("✅ Hora formateada:", h);
    return h;
  };

  useEffect(() => {
    if (!id_viaje) return;

    connectSocketToViaje(id_viaje);

    const handler = (data: any) => {
      console.log("📥 RAW recibido del socket:", data);

      const item = Array.isArray(data) ? data[0] : data;

      console.log("📌 Item normalizado:", item);
      console.log("👉 typeof timestamp:", typeof item.timestamp);
      console.log("👉 timestamp recibido:", item.timestamp);

      let ts: any = item.timestamp;

      // Caso Date object
      if (ts && typeof ts === "object" && typeof ts.toISOString === "function") {
        console.log("🔵 Timestamp es Date object, convirtiendo a ISO...");
        ts = ts.toISOString();
      }

      // Si llega string local, lo dejamos tal cual para que lo maneje formatHora
      console.log("✅ Timestamp final a enviar a formatHora:", ts);

      setCoord(item);
      setHora(formatHora(ts));

      if (!mapRef.current) {
        console.log("🗺️ Inicializando mapa...");
        mapRef.current = L.map("map").setView([item.latitud, item.longitud], 16);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(mapRef.current);

        markerRef.current = L.marker([item.latitud, item.longitud]).addTo(
          mapRef.current
        );
      } else {
        console.log("📍 Actualizando marcador...");
        markerRef.current?.setLatLng([item.latitud, item.longitud]);

        mapRef.current.setView(
          [item.latitud, item.longitud],
          mapRef.current.getZoom(),
          { animate: true, duration: 0.5 }
        );
      }
    };

    onCoordenada(handler);

    return () => {
      offCoordenada(handler);
      disconnectSocket();
    };
  }, [id_viaje]);

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ← Volver
          </button>

          <div style={styles.titleSection}>
            <div style={styles.iconCircle}>
              <span style={styles.icon}>🗺️</span>
            </div>
            <div>
              <h2 style={styles.title}>Seguimiento en Tiempo Real</h2>
              <p style={styles.subtitle}>Monitoreando ubicación del vehículo</p>
            </div>
          </div>
        </div>

        <div style={styles.mapContainer}>
          <div id="map" style={styles.map} />
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>
            <span>📊</span> Datos de Ubicación
          </h3>

          {coord ? (
            <div style={styles.infoGrid}>
              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>📍 Latitud</div>
                <div style={styles.infoValue}>{coord.latitud.toFixed(6)}</div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>📍 Longitud</div>
                <div style={styles.infoValue}>{coord.longitud.toFixed(6)}</div>
              </div>

              <div style={{ ...styles.infoCard, gridColumn: "1 / -1" }}>
                <div style={styles.infoLabel}>🕒 Última Actualización</div>
                <div style={styles.infoValue}>{hora}</div>
              </div>
            </div>
          ) : (
            <div style={styles.loadingState}>
              <p style={styles.loadingText}>Esperando señal GPS del vehículo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Viewviaje;





const styles: Record<string, React.CSSProperties> = {
  container: {
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
    animation: "fadeIn 0.5s ease",
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

  mapContainer: {
    background: "#f7fafc",
    padding: "1rem",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    marginBottom: "1.5rem",
  },

  map: {
    height: "520px",
    width: "100%",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },

  infoBox: {
    background: "#f7fafc",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
  },

  infoTitle: {
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
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
  },

  infoCard: {
    background: "#ffffff",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
  },

  infoLabel: {
    fontSize: "0.85rem",
    color: "#718096",
    marginBottom: "0.5rem",
    fontWeight: "600",
  },

  infoValue: {
    fontSize: "1.1rem",
    color: "#2d3748",
    fontWeight: "700",
    fontFamily: "monospace",
  },

  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    gap: "1rem",
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    fontSize: "1rem",
    color: "#718096",
    margin: 0,
    textAlign: "center",
  },
};