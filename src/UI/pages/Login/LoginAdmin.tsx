import React, { useState } from "react";
import { loginAdminUseCase } from "../../../application/authUseCases";
import { IAdministrador } from "../../../models/IAdministrador";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setPerfil: (perfil: IAdministrador) => void;
}

export default function LoginAdmin({ setPerfil }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await loginAdminUseCase(email.trim(), password.trim());
      setPerfil(user);
      localStorage.setItem("token", user.token);
      localStorage.setItem("perfil", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err: any) {
      setError("Error en el login. Verifica tus credenciales.");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "3rem auto",
      padding: "2rem",
      borderRadius: "10px",
      backgroundColor: "#fff",
      color: "#c00",
      border: "2px solid #c00",
      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      textAlign: "center"
    }}>
      <h1 style={{ color: "#c00" }}>Login</h1>
      <h3 style={{ marginBottom: "2rem" }}>La Perla del Altomayo</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0", borderRadius: "5px", border: "1px solid #c00" }} />
        </div>

        <div>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0", borderRadius: "5px", border: "1px solid #c00" }} />
        </div>

        {error && <p style={{ color: "#c00", marginTop: "0.5rem" }}>{error}</p>}

        <button type="submit" style={{
          width: "100%",
          padding: "0.7rem",
          marginTop: "1rem",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#c00",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}>Ingresar</button>
      </form>
    </div>
  );
}
