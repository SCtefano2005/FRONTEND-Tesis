// src/ui/pages/BuscarConductor.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarConductorPorDniUseCase } from "../../../../application/conductorUseCases";
import { IConductorResponse } from "../../../../models/IConductorResponse";

const BuscarConductor: React.FC = () => {
  const [dni, setDni] = useState("");
  const [conductorData, setConductorData] = useState<IConductorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleBuscar = async () => {
    setError(null);
    setConductorData(null);
    setLoading(true);

    try {
      const data = await buscarConductorPorDniUseCase(dni);
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

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      <h2>Buscar Conductor por DNI</h2>

      <input
        type="text"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        placeholder="Ingrese DNI"
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <button onClick={handleBuscar} disabled={loading || !dni}>
        {loading ? "Buscando..." : "Buscar"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {conductorData && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc" }}>
          <h3>Datos del Conductor</h3>

          <p><strong>Nombre:</strong> {conductorData.usuario.datos_personal.nombres}</p>
          <p><strong>Apellido:</strong> {conductorData.usuario.datos_personal.apellidos}</p>
          <p><strong>DNI:</strong> {conductorData.usuario.identificacion}</p>
          <p><strong>Email:</strong> {conductorData.usuario.datos_personal.email}</p>
          <p><strong>Teléfono:</strong> {conductorData.usuario.datos_personal.telefono}</p>
          <p><strong>Dirección:</strong> {conductorData.usuario.datos_personal.direccion}</p>

          <h4>Licencia</h4>
          <p><strong>Número:</strong> {conductorData.conductor.numero_licencia}</p>
          <p><strong>Categoría:</strong> {conductorData.conductor.categoria_lic}</p>
          <p><strong>Estado:</strong> {conductorData.conductor.estado_conduct}</p>

          <h4>Documentos</h4>
          <ul>
            {conductorData.conductor.documentos.map((doc) => (
              <li key={doc.url}>
                <strong>{doc.nombre}</strong> - <a href={doc.url} target="_blank" rel="noreferrer">Ver</a> - Vence: {new Date(doc.vence).toLocaleDateString()}
              </li>
            ))}
          </ul>

          <h4>Experiencia</h4>
          <p><strong>Años:</strong> {conductorData.conductor.experiencia.anios}</p>
          <p><strong>Historial:</strong> {conductorData.conductor.experiencia.historial.join(", ")}</p>

          <button
            onClick={handleEditar}
            style={{ marginTop: 15, padding: "8px 12px", cursor: "pointer" }}
          >
            Editar Conductor
          </button>
        </div>
      )}
    </div>
  );
};

export default BuscarConductor;
