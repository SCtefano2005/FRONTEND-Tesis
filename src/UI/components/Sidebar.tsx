import React from "react";
import { IAdministrador } from "../../models/IAdministrador";

interface SidebarProps {
  perfil: IAdministrador;
  onLogout: () => void;
}

export default function Sidebar({ perfil, onLogout }: SidebarProps) {
  return (
    <aside style={{
      width: 250,
      backgroundColor: "#c00",
      color: "#fff",
      height: "100vh",
      padding: "2rem 1rem",
      boxSizing: "border-box",
    }}>
      <h2>{perfil.nombres} {perfil.apellidos}</h2>
      <p>{perfil.email}</p>
      <p>Área: {perfil.area}</p>
      <p>Nivel: {perfil.nivel}</p>
      <hr style={{ borderColor: "#fff", margin: "1rem 0" }} />
      <button onClick={onLogout} style={{
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: 5,
        backgroundColor: "#fff",
        color: "#c00",
        fontWeight: "bold",
        cursor: "pointer",
        width: "100%",
        marginTop: "1rem",
      }}>
        Cerrar Sesión
      </button>
    </aside>
  );
}
