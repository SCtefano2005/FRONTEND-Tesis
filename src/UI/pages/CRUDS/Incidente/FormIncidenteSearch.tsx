// views/ListaIncidentesView.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ObtenerListaIncidentes } from "../../../../application/incidenteUseCases";
import { IIncidente } from "../../../../models/IIncidente";

const ListaIncidentesView: React.FC = () => {
  const [incidentes, setIncidentes] = useState<IIncidente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const cargarIncidentes = async () => {
      try {
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

  if (loading) return <p>Cargando incidentes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>📋 Lista de Incidentes</h2>

      {incidentes.length === 0 ? (
        <p>No hay incidentes registrados.</p>
      ) : (
        <ul>
          {incidentes.map((inc) => (
            <li key={inc._id}>
              <strong>{inc.tipo}</strong> — Estado: {inc.estado}
              <br />
              📍 Ubicación: {inc.ubicacion.lat}, {inc.ubicacion.lng}
              <br />
              👤 Conductor: {inc.UsuarioConductorId.nombreyapellido}  
              ({inc.UsuarioConductorId.identificacion})
              <br />
              📞 Tel: {inc.UsuarioConductorId.telefono}
              <br />
              🕒 Fecha: {new Date(inc.timestamp).toLocaleString()}
              <br /><br />

              {/* ✅ Botón para ver detalles */}
              <button
                onClick={() => navigate(`/incidentes/${inc._id}`)}
                style={{
                  padding: "6px 12px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Más detalles
              </button>

              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaIncidentesView;
