// src/UI/pages/CRUDS/Conductor/EditarConductor.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarConductorPorDniUseCase, actualizarConductorUseCase } from "../../../../application/conductorUseCases";
import { IConductorDetalle, IDatosPersonal } from "../../../../models/IConductor";
import { IConductorResponse } from "../../../../models/IConductorResponse";

// Tipo para edición, omitimos password
type IConductorEditable = Omit<IConductorResponse, "usuario"> & {
  usuario: Omit<IConductorResponse["usuario"], "rol"> & { rol: "conductor" };
};

const EditarConductor: React.FC = () => {
  const { dni } = useParams<{ dni: string }>();
  const navigate = useNavigate();
  const [conductor, setConductor] = useState<IConductorEditable | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  // Cambios en datos personales
  const handleChangeDatosPersonales = (field: keyof IDatosPersonal, value: string) => {
    if (!conductor) return;
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
    if (!conductor) return;
    setConductor({
      ...conductor,
      conductor: {
        ...conductor.conductor,
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conductor) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await actualizarConductorUseCase(conductor.usuario.identificacion, {
        estado: conductor.usuario.estado,
        datos_personal: conductor.usuario.datos_personal,
        config_sesion: conductor.usuario.config_sesion,
        conductor: conductor.conductor,
      });
      setSuccess("✅ Conductor actualizado correctamente");
    } catch (err: any) {
      console.error("❌ Error al actualizar:", err);
      setError(err.message || "Error al actualizar conductor");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !conductor) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "3rem",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              margin: "0 auto 1rem",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: "#4a5568", fontSize: "1.1rem", margin: 0 }}>
            Cargando datos del conductor...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  if (error && !conductor) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "3rem",
            borderRadius: "20px",
            textAlign: "center",
            maxWidth: "500px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ color: "#c53030", margin: "0 0 1rem 0" }}>Error</h2>
          <p style={{ color: "#4a5568", marginBottom: "2rem" }}>{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!conductor) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "3rem",
            borderRadius: "20px",
            textAlign: "center",
            maxWidth: "500px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
          <h2 style={{ color: "#4a5568", margin: "0 0 1rem 0" }}>
            No se encontró el conductor
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/buscar-conductor")}
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
            ← Volver a Buscador
          </button>
        </div>

        {/* Card principal */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            padding: "2.5rem",
          }}
        >
          {/* Título */}
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "2rem",
                color: "#2d3748",
                margin: "0 0 0.5rem 0",
                fontWeight: "700",
              }}
            >
              ✏️ Editar Conductor
            </h2>
            <p style={{ color: "#718096", margin: 0 }}>
              DNI: {conductor.usuario.identificacion}
            </p>
          </div>

          {/* Alertas */}
          {error && (
            <div
              style={{
                background: "#fed7d7",
                color: "#c53030",
                padding: "1rem",
                borderRadius: "12px",
                marginBottom: "1.5rem",
                border: "1px solid #fc8181",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div
              style={{
                background: "#c6f6d5",
                color: "#2f855a",
                padding: "1rem",
                borderRadius: "12px",
                marginBottom: "1.5rem",
                border: "1px solid #68d391",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {/* Datos Personales */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  color: "#4a5568",
                  marginBottom: "1.5rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>👤</span> Datos Personales
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#4a5568",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      Nombres
                    </label>
                    <input
                      type="text"
                      value={conductor.usuario.datos_personal.nombres}
                      onChange={(e) => handleChangeDatosPersonales("nombres", e.target.value)}
                      placeholder="Nombres"
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.3s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#4a5568",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      Apellidos
                    </label>
                    <input
                      type="text"
                      value={conductor.usuario.datos_personal.apellidos}
                      onChange={(e) => handleChangeDatosPersonales("apellidos", e.target.value)}
                      placeholder="Apellidos"
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.3s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={conductor.usuario.datos_personal.email}
                    onChange={(e) => handleChangeDatosPersonales("email", e.target.value)}
                    placeholder="ejemplo@email.com"
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#4a5568",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={conductor.usuario.datos_personal.telefono}
                      onChange={(e) => handleChangeDatosPersonales("telefono", e.target.value)}
                      placeholder="+51987654321"
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.3s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#4a5568",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={conductor.usuario.datos_personal.direccion}
                      onChange={(e) => handleChangeDatosPersonales("direccion", e.target.value)}
                      placeholder="Dirección"
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.3s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Datos de Conductor */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  color: "#4a5568",
                  marginBottom: "1.5rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>🪪</span> Datos de Licencia
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#4a5568",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      Número de Licencia
                    </label>
                    <input
                      type="text"
                      value={conductor.conductor.numero_licencia}
                      onChange={(e) =>
                        handleChangeConductorDetalle("numero_licencia", e.target.value)
                      }
                      placeholder="L123456"
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.3s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#4a5568",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={conductor.conductor.categoria_lic}
                      onChange={(e) =>
                        handleChangeConductorDetalle("categoria_lic", e.target.value)
                      }
                      placeholder="A-IIb"
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.3s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Estado del Conductor
                  </label>
                  <select
                    value={conductor.conductor.estado_conduct}
                    onChange={(e) =>
                      handleChangeConductorDetalle(
                        "estado_conduct",
                        e.target.value as "activo" | "inactivo" | "suspendido"
                      )
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s",
                      boxSizing: "border-box",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="suspendido">Suspendido</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "2rem",
                paddingTop: "2rem",
                borderTop: "2px solid #e2e8f0",
              }}
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  flex: 1,
                  background: "#fff",
                  color: "#4a5568",
                  padding: "1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#f7fafc";
                  e.currentTarget.style.borderColor = "#cbd5e0";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  background: loading
                    ? "#a0aec0"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  padding: "1rem",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: loading ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
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
                {loading ? "⏳ Guardando..." : "💾 Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarConductor;