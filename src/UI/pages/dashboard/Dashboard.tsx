import React from "react";
import { useNavigate } from "react-router-dom";
import { IAdministrador } from "../../../models/IAdministrador";

interface DashboardProps {
  perfil: IAdministrador;
  onLogout: () => void;
}

export default function Dashboard({ perfil, onLogout }: DashboardProps) {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Conductores",
      icon: "👤",
      description: "Gestiona conductores",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      path: "/buscar-conductor",
    },
    {
      title: "Buses",
      icon: "🚌",
      description: "Administra vehículos",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      path: "/bus/search",
    },
    {
      title: "Rutas",
      icon: "🗺️",
      description: "Configura rutas",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      path: "/ruta/search",
    },
    {
      title: "Viajes",
      icon: "🧭",
      description: "Monitorea viajes",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      path: "/viaje/search",
    },
    {
      title: "ESP32",
      icon: "🔌",
      description: "Dispositivos IoT",
      color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      path: "/esp32/searchbycode",
    },
    {
      title: "Administradores",
      icon: "👥",
      description: "Gestiona admins",
      color: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
      path: "/admin/create",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto 2rem",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                width: "60px",
                height: "60px",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
              }}
            >
              🎯
            </div>
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  color: "#2d3748",
                  margin: "0 0 0.25rem 0",
                  fontWeight: "700",
                }}
              >
                Dashboard
              </h1>
              <p style={{ color: "#718096", margin: 0, fontSize: "1rem" }}>
                Bienvenido, {perfil.nombres || "Administrador"}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              background: "linear-gradient(135deg, #f56565 0%, #c53030 100%)",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(245, 101, 101, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(245, 101, 101, 0.6)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(245, 101, 101, 0.4)";
            }}
          >
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                animation: `fadeIn 0.5s ease ${index * 0.1}s both`,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
              }}
            >
              {/* Gradient Background */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "5px",
                  background: card.color,
                }}
              />

              {/* Icon */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: card.color,
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  marginBottom: "1.5rem",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
                }}
              >
                {card.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "1.5rem",
                  color: "#2d3748",
                  margin: "0 0 0.5rem 0",
                  fontWeight: "700",
                }}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  color: "#718096",
                  margin: "0 0 1.5rem 0",
                  fontSize: "0.95rem",
                }}
              >
                {card.description}
              </p>

              {/* Arrow */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#667eea",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                <span>Ver más</span>
                <span style={{ fontSize: "1.2rem" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Footer */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "2rem auto 0",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "0.5rem",
                }}
              >
                {perfil.email?.split("@")[0] || "Admin"}
              </div>
              <div style={{ color: "#718096", fontSize: "0.9rem" }}>
                Usuario actual
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "0.5rem",
                }}
              >
                { "Admin"}
              </div>
              <div style={{ color: "#718096", fontSize: "0.9rem" }}>
                Rol del sistema
              </div>
            </div>



<div style={{ textAlign: "center" }}>
  <div
    style={{
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#000000", // Negro sólido
      marginBottom: "0.5rem"
    }}
  >
    6
  </div>
  <div style={{ color: "#000000", fontSize: "0.9rem" }}>
    Módulos disponibles
  </div>
</div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}