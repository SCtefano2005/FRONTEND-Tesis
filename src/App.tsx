// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginAdmin from "./UI/pages/Login/LoginAdmin";
import Dashboard from "./UI/pages/dashboard/Dashboard";
import CrearConductor from "./UI/pages/CRUDS/Conductor/CrearConductor";
import BuscarConductor from "./UI/pages/CRUDS/Conductor/BuscarConductordni";

import { IAdministrador } from "./models/IAdministrador";
import EditarConductor from "./UI/pages/CRUDS/Conductor/EditarConductor";

// Componente para proteger rutas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const perfil = localStorage.getItem("perfil");
  if (!perfil) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const [perfil, setPerfil] = React.useState<IAdministrador | null>(() => {
    const saved = localStorage.getItem("perfil");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    setPerfil(null);
    localStorage.removeItem("perfil");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginAdmin setPerfil={setPerfil} />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {perfil ? <Dashboard perfil={perfil} onLogout={handleLogout} /> : null}
            </ProtectedRoute>
          }
        />

        <Route
          path="/conductor/crear-conductor"
          element={
            <ProtectedRoute>
              <CrearConductor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buscar-conductor"
          element={
            <ProtectedRoute>
              <BuscarConductor /> {/* Componente React, no el use case */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/conductor/editar/:dni"
          element={
            <ProtectedRoute>
              <EditarConductor />
            </ProtectedRoute>
          }
        />
        {/* Si quieres agregar más rutas protegidas */}
        {/*
        <Route
          path="/viajes"
          element={
            <ProtectedRoute>
              {perfil ? <Viajes perfil={perfil} /> : null}
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              {perfil ? <Reportes perfil={perfil} /> : null}
            </ProtectedRoute>
          }
        />
        */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
