import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllRutasUseCase, updateRutaUseCase } from "../../../../application/rutaUseCases";
import { IRuta, IRutaResponse, IParadero } from "../../../../models/IRuta";

const FormEditarRuta: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ruta, setRuta] = useState<IRutaResponse | null>(null);
  const [nombre, setNombre] = useState("");
  const [paraderos, setParaderos] = useState<IParadero[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 🔹 Cargar la ruta existente
  useEffect(() => {
    const fetchRuta = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const rutas = await getAllRutasUseCase();
        const rutaEncontrada = rutas.find((r) => r._id === id);

        if (rutaEncontrada) {
          setRuta(rutaEncontrada);
          setNombre(rutaEncontrada.nombre);
          setParaderos(rutaEncontrada.paraderos || []);
          setMensaje("✅ Ruta cargada correctamente");
        } else {
          setMensaje("⚠️ No se encontró la ruta solicitada");
        }
      } catch (error: any) {
        setMensaje("❌ Error al cargar ruta: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRuta();
  }, [id]);

  // 🔹 Manejar cambios en paraderos
  const handleParaderoChange = (index: number, field: keyof IParadero, value: string | number) => {
    const nuevosParaderos = [...paraderos];
    nuevosParaderos[index] = { ...nuevosParaderos[index], [field]: value };
    setParaderos(nuevosParaderos);
  };

  // 🔹 Agregar un nuevo paradero
  const handleAgregarParadero = () => {
    setParaderos([...paraderos, { nombre: "", orden: paraderos.length + 1 }]);
  };

  // 🔹 Eliminar un paradero
  const handleEliminarParadero = (index: number) => {
    const nuevosParaderos = paraderos.filter((_, i) => i !== index);
    // Reordenar los paraderos restantes
    setParaderos(nuevosParaderos.map((p, i) => ({ ...p, orden: i + 1 })));
  };

  // 🔹 Guardar cambios
  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ruta) {
      setMensaje("⚠️ No se ha cargado ninguna ruta para actualizar");
      return;
    }

    setUpdating(true);
    try {
      const data: Partial<IRuta> = { nombre, paraderos };
      await updateRutaUseCase(ruta._id, data);
      setMensaje(`✅ Ruta "${nombre}" actualizada correctamente`);

      setTimeout(() => navigate("/ruta/search"), 1500);
    } catch (error: any) {
      setMensaje("❌ Error al actualizar ruta: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  // 🔹 Estado de carga
  if (loading) {
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
            Cargando ruta...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  // 🔹 Error: ruta no encontrada
  if (!ruta && !loading) {
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
          <h2 style={{ color: "#c53030", margin: "0 0 1rem 0" }}>
            Ruta no encontrada
          </h2>
          <p style={{ color: "#4a5568", marginBottom: "2rem" }}>
            No se pudo encontrar la ruta solicitada.
          </p>
          <button
            onClick={() => navigate("/ruta/buscar")}
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
            Volver a Buscar Rutas
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          padding: "2.5rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/ruta/search")}
            style={{
              background: "transparent",
              border: "2px solid #667eea",
              color: "#667eea",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "600",
              marginBottom: "1rem",
              transition: "all 0.3s ease",
            }}
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
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50%",
                padding: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontSize: "3rem" }}>✏️</span>
            </div>
            <h2
              style={{
                fontSize: "2rem",
                color: "#2d3748",
                margin: "0 0 0.5rem 0",
                fontWeight: "700",
              }}
            >
              Editar Ruta
            </h2>
            <p style={{ color: "#718096", margin: 0 }}>
              Modifique el nombre y los paraderos de la ruta
            </p>
          </div>
        </div>

        {/* Alertas */}
        {mensaje && (
          <div
            style={{
              background: mensaje.includes("❌")
                ? "#fed7d7"
                : mensaje.includes("⚠️")
                ? "#feebc8"
                : "#c6f6d5",
              color: mensaje.includes("❌")
                ? "#c53030"
                : mensaje.includes("⚠️")
                ? "#c05621"
                : "#2f855a",
              padding: "1rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              border: mensaje.includes("❌")
                ? "1px solid #fc8181"
                : mensaje.includes("⚠️")
                ? "1px solid #fbd38d"
                : "1px solid #68d391",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              animation: "slideDown 0.3s ease",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>
              {mensaje.includes("❌") ? "⚠️" : mensaje.includes("⚠️") ? "⚠️" : "✅"}
            </span>
            <span>{mensaje}</span>
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleActualizar}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Nombre de la ruta */}
          <div
            style={{
              background: "#f7fafc",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                color: "#4a5568",
                marginBottom: "1rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>🚌</span> Información de la Ruta
            </h3>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#4a5568",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              Nombre de la Ruta *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ejemplo: Ruta Sur"
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
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
          </div>

          {/* Paraderos */}
          <div
            style={{
              background: "#f7fafc",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  color: "#4a5568",
                  margin: 0,
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>📍</span> Paraderos de la Ruta
              </h3>
              <span
                style={{
                  background: "#667eea",
                  color: "#fff",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                {paraderos.length} {paraderos.length === 1 ? "paradero" : "paraderos"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {paraderos.map((paradero, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    background: "#fff",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {/* Número de orden */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      fontWeight: "700",
                      flexShrink: 0,
                    }}
                  >
                    {paradero.orden}
                  </div>

                  {/* Input del nombre */}
                  <input
                    type="text"
                    value={paradero.nombre}
                    onChange={(e) =>
                      handleParaderoChange(index, "nombre", e.target.value)
                    }
                    placeholder={`Nombre del paradero ${index + 1}`}
                    required
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
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

                  {/* Botón eliminar */}
                  {paraderos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleEliminarParadero(index)}
                      style={{
                        background: "#fed7d7",
                        color: "#c53030",
                        width: "40px",
                        height: "40px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        transition: "all 0.3s ease",
                        flexShrink: 0,
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#fc8181";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#fed7d7";
                        e.currentTarget.style.color = "#c53030";
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Botón agregar paradero */}
            <button
              type="button"
              onClick={handleAgregarParadero}
              style={{
                width: "100%",
                marginTop: "1rem",
                background: "#fff",
                color: "#667eea",
                padding: "0.875rem",
                border: "2px dashed #667eea",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#f8f9ff";
                e.currentTarget.style.borderColor = "#5568d3";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderColor = "#667eea";
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>➕</span>
              <span>Agregar Paradero</span>
            </button>
          </div>

          {/* Botones de acción */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              paddingTop: "1rem",
              borderTop: "2px solid #e2e8f0",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/ruta/search")}
              disabled={updating}
              style={{
                flex: 1,
                background: "#fff",
                color: "#4a5568",
                padding: "1rem",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: updating ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                if (!updating) {
                  e.currentTarget.style.background = "#f7fafc";
                  e.currentTarget.style.borderColor = "#cbd5e0";
                }
              }}
              onMouseOut={(e) => {
                if (!updating) {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }
              }}
            >
              🔙 Volver
            </button>
            <button
              type="submit"
              disabled={updating}
              style={{
                flex: 1,
                background: updating
                  ? "#a0aec0"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                padding: "1rem",
                border: "none",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: updating ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: updating ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              onMouseOver={(e) => {
                if (!updating) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                }
              }}
              onMouseOut={(e) => {
                if (!updating) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                }
              }}
            >
              {updating ? (
                <>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "3px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "3px solid #fff",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Actualizar Ruta</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
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
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default FormEditarRuta;