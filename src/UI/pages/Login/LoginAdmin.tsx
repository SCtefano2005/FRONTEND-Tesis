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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginAdminUseCase(email.trim(), password.trim());
      setPerfil(user);
      localStorage.setItem("token", user.token);
      localStorage.setItem("perfil", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err: any) {
      setError("Error en el login. Verifica tus credenciales.");
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />

      {/* Login Card */}
      <div
        style={{
          maxWidth: "450px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          padding: "3rem",
          position: "relative",
          zIndex: 1,
          animation: "slideIn 0.5s ease",
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              padding: "1.5rem",
              marginBottom: "1rem",
              boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
            }}
          >
            <span style={{ fontSize: "3rem" }}>🚌</span>
          </div>
          <h1
            style={{
              fontSize: "2rem",
              color: "#2d3748",
              margin: "0 0 0.5rem 0",
              fontWeight: "700",
            }}
          >
            Bienvenido
          </h1>
          <h3
            style={{
              fontSize: "1.2rem",
              color: "#667eea",
              margin: "0",
              fontWeight: "600",
            }}
          >
            La Perla del Altomayo
          </h3>
          <p
            style={{
              color: "#718096",
              margin: "0.5rem 0 0 0",
              fontSize: "0.9rem",
            }}
          >
            Sistema de Gestión de Transportes
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Email Input */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#4a5568",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              📧 Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@email.com"
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                background: loading ? "#f7fafc" : "#fff",
              }}
              onFocus={(e) => {
                if (!loading) {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#4a5568",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              🔒 Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  paddingRight: "3rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                  background: loading ? "#f7fafc" : "#fff",
                }}
                onFocus={(e) => {
                  if (!loading) {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "1.2rem",
                  padding: "0.25rem",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "#fed7d7",
                color: "#c53030",
                padding: "0.875rem",
                borderRadius: "12px",
                border: "1px solid #fc8181",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                animation: "slideDown 0.3s ease",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              background: loading
                ? "#a0aec0"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: loading ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
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
            {loading ? (
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
                <span>Ingresando...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            color: "#718096",
            fontSize: "0.85rem",
          }}
        >
          <p style={{ margin: "0.5rem 0" }}>
            ¿Problemas para ingresar?
          </p>
          <p style={{ margin: "0.5rem 0" }}>
            Contacta al administrador del sistema
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
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
}