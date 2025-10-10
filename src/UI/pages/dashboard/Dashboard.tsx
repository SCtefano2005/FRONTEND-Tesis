import React from "react";
import Sidebar from "../../components/Sidebar";
import { IAdministrador } from "../../../models/IAdministrador";
import { Link } from "react-router-dom";

interface DashboardProps {
  perfil: IAdministrador;
  onLogout: () => void;
}

export default function Dashboard({ perfil, onLogout }: DashboardProps) {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: "2rem",
    backgroundColor: "#f7f7f7",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    border: "1px solid #c00",
    borderRadius: 8,
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    cursor: "pointer",
    textDecoration: "none",
    color: "#000",
    transition: "transform 0.2s ease",
  };

  const cardHoverStyle: React.CSSProperties = {
    transform: "scale(1.05)",
  };

  return (
    <div style={containerStyle}>
      <Sidebar perfil={perfil} onLogout={onLogout} />

      <main style={contentStyle}>
        <h1>Dashboard</h1>
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            marginTop: "2rem",
          }}
        >
          {/* Card que lleva a crear conductor */}
          <Link
            to="/conductor/crear-conductor"
            style={cardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = cardHoverStyle.transform!)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <h3>Conductores</h3>

          </Link>

          <Link
            to="/buscar-conductor"
            style={cardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = cardHoverStyle.transform!)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <h3>Buscar</h3>

          </Link>
          <div style={cardStyle}>
            <h3>Viajes</h3>
            <p>45 activos</p>
          </div>
          <div style={cardStyle}>
            <h3>Buses</h3>
            <p>10 disponibles</p>
          </div>
          <div style={cardStyle}>
            <h3>Reportes</h3>
            <p>3 nuevos</p>
          </div>
        </div>
      </main>
    </div>
  );
}

