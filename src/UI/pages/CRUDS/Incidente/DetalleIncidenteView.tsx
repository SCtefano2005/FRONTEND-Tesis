import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  ObtenerIncidentePorId,
  CambiarEstadoIncidente,
} from "../../../../application/incidenteUseCases";
import { IIncidente } from "../../../../models/IIncidente";

// Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Configurar icono por defecto
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const DetalleIncidenteView: React.FC = () => {
  const { id } = useParams();
  const [incidente, setIncidente] = useState<IIncidente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accionLoading, setAccionLoading] = useState(false);

  // refs para Leaflet
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        if (!id) return;
        const data = await ObtenerIncidentePorId(id);
        setIncidente(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar incidente");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  // Inicializar Leaflet cuando llegan las coordenadas
  useEffect(() => {
    if (!incidente) return;

    const { lat, lng } = incidente.ubicacion;

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
      await CambiarEstadoIncidente(id, nuevoEstado);

      setIncidente((prev) =>
        prev ? { ...prev, estado: nuevoEstado } : prev
      );
    } catch (err: any) {
      alert(err.message || "Error al cambiar estado");
    } finally {
      setAccionLoading(false);
    }
  };

  if (loading) return <p>Cargando incidente...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!incidente) return <p>No se encontró el incidente.</p>;

  return (
    <div>
      <h2>📝 Detalles del Incidente</h2>

      <p>
        <strong>ID:</strong> {incidente._id}
      </p>
      <p>
        <strong>Tipo:</strong> {incidente.tipo}
      </p>
      <p>
        <strong>Estado:</strong> {incidente.estado}
      </p>

      <p>
        <strong>Ubicación:</strong> Lat {incidente.ubicacion.lat}, Lng{" "}
        {incidente.ubicacion.lng}
      </p>

      {/* 🟦 MAPA LEAFLET */}
      <div
        id="mapa-incidente"
        style={{
          height: "350px",
          width: "100%",
          borderRadius: "10px",
          marginTop: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        }}
      />

      <h3 style={{ marginTop: "20px" }}>👤 Conductor</h3>
      <p>
        <strong>Nombre:</strong>{" "}
        {incidente.UsuarioConductorId.nombreyapellido}
      </p>
      <p>
        <strong>DNI:</strong> {incidente.UsuarioConductorId.identificacion}
      </p>
      <p>
        <strong>Teléfono:</strong> {incidente.UsuarioConductorId.telefono}
      </p>

      <p>
        <strong>Fecha:</strong>{" "}
        {new Date(incidente.timestamp).toLocaleString()}
      </p>

      <hr />

      {/* BOTONES SEGÚN ESTADO */}
      {incidente.estado === "Pendiente" && (
        <button
          disabled={accionLoading}
          onClick={() => cambiarEstado("Revisado")}
          style={{
            padding: "8px 14px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {accionLoading ? "Procesando..." : "Revisar"}
        </button>
      )}

      {incidente.estado === "Revisado" && (
        <button
          disabled={accionLoading}
          onClick={() => cambiarEstado("Solucionado")}
          style={{
            padding: "8px 14px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {accionLoading ? "Procesando..." : "Solucionar"}
        </button>
      )}
    </div>
  );
};

export default DetalleIncidenteView;
