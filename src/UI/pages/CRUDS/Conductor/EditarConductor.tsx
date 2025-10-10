// src/UI/pages/CRUDS/Conductor/EditarConductor.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buscarConductorPorDniUseCase, actualizarConductorUseCase } from "../../../../application/conductorUseCases";
import { IConductorDetalle, IDatosPersonal } from "../../../../models/IConductor";
import { IConductorResponse } from "../../../../models/IConductorResponse";

// Tipo para edición, omitimos password
type IConductorEditable = Omit<IConductorResponse, "usuario"> & {
  usuario: Omit<IConductorResponse["usuario"], "rol"> & { rol: "conductor" };
};

const EditarConductor: React.FC = () => {
  const { dni } = useParams<{ dni: string }>();
  const [conductor, setConductor] = useState<IConductorEditable | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del conductor
  useEffect(() => {
    if (!dni) return;

    const fetchConductor = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await buscarConductorPorDniUseCase(dni);
        setConductor({
          usuario: { ...data.usuario, rol: "conductor" },
          conductor: data.conductor,
        });
      } catch (err: any) {
        console.error("❌ Error al cargar conductor:", err);
        setError(err.message || "Error al cargar conductor");
      } finally {
        setLoading(false);
      }
    };

    fetchConductor();
  }, [dni]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!conductor) return <p>No se encontró el conductor.</p>;

  // Cambios en datos personales
  const handleChangeDatosPersonales = (field: keyof IDatosPersonal, value: string) => {
    setConductor({
      ...conductor,
      usuario: {
        ...conductor.usuario,
        datos_personal: {
          ...conductor.usuario.datos_personal,
          [field]: value,
        },
      },
    });
  };

  // Cambios en detalles de conductor
  const handleChangeConductorDetalle = (field: keyof IConductorDetalle, value: any) => {
    setConductor({
      ...conductor,
      conductor: {
        ...conductor.conductor,
        [field]: value,
      },
    });
  };

const handleSubmit = async () => {
  if (!conductor) return;
  setLoading(true);
  setError(null);


  try {
    await actualizarConductorUseCase(conductor.usuario.identificacion, {
      estado: conductor.usuario.estado,
      datos_personal: conductor.usuario.datos_personal,
      config_sesion: conductor.usuario.config_sesion,
      conductor: conductor.conductor,
    });


  } catch (err: any) {
    console.error("❌ Error al actualizar:", err);
    setError(err.message || "Error al actualizar conductor");
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Editar Conductor</h2>

      <h3>Datos Personales</h3>
      <input
        type="text"
        value={conductor.usuario.datos_personal.nombres}
        onChange={(e) => handleChangeDatosPersonales("nombres", e.target.value)}
        placeholder="Nombres"
      />
      <input
        type="text"
        value={conductor.usuario.datos_personal.apellidos}
        onChange={(e) => handleChangeDatosPersonales("apellidos", e.target.value)}
        placeholder="Apellidos"
      />
      <input
        type="text"
        value={conductor.usuario.datos_personal.email}
        onChange={(e) => handleChangeDatosPersonales("email", e.target.value)}
        placeholder="Email"
      />
      <input
        type="text"
        value={conductor.usuario.datos_personal.telefono}
        onChange={(e) => handleChangeDatosPersonales("telefono", e.target.value)}
        placeholder="Teléfono"
      />
      <input
        type="text"
        value={conductor.usuario.datos_personal.direccion}
        onChange={(e) => handleChangeDatosPersonales("direccion", e.target.value)}
        placeholder="Dirección"
      />

      <h3>Datos de Conductor</h3>
      <input
        type="text"
        value={conductor.conductor.numero_licencia}
        onChange={(e) => handleChangeConductorDetalle("numero_licencia", e.target.value)}
        placeholder="Número de licencia"
      />
      <input
        type="text"
        value={conductor.conductor.categoria_lic}
        onChange={(e) => handleChangeConductorDetalle("categoria_lic", e.target.value)}
        placeholder="Categoría de licencia"
      />
      <input
        type="text"
        value={conductor.conductor.estado_conduct}
        onChange={(e) => handleChangeConductorDetalle("estado_conduct", e.target.value)}
        placeholder="Estado conductor"
      />

      <button onClick={handleSubmit} style={{ marginTop: 20 }}>
        Guardar cambios
      </button>
    </div>
  );
};

export default EditarConductor;
