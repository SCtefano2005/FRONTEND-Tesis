// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import 'leaflet/dist/leaflet.css';

import LoginAdmin from "./UI/pages/Login/LoginAdmin";
import Dashboard from "./UI/pages/dashboard/Dashboard";
import CrearConductor from "./UI/pages/CRUDS/Conductor/CrearConductor";
import BuscarConductor from "./UI/pages/CRUDS/Conductor/BuscarConductordni";
import CrearAdministrador from "./UI/pages/CRUDS/Administrador/CrearAdministrador";
import FormCrearEsp32 from "./UI/pages/CRUDS/Esp32/CreasEsp32";
import FormSearchbyCodigo from "./UI/pages/CRUDS/Esp32/Buscar_x_codigo"

import { IAdministrador } from "./models/IAdministrador";
import EditarConductor from "./UI/pages/CRUDS/Conductor/EditarConductor";
import FormEditEsp32 from "./UI/pages/CRUDS/Esp32/FormEditEsp32";
import FormCreateRuta from "./UI/pages/CRUDS/Ruta/FormCreateRuta";
import FormBuscarRuta from "./UI/pages/CRUDS/Ruta/FormBuscarRuta";
import FormEditarRuta from "./UI/pages/CRUDS/Ruta/FormEditarRuta";
import FormCrearBus from "./UI/pages/CRUDS/Bus/FormCreateBus";
import FormBuscarBus from "./UI/pages/CRUDS/Bus/FormBuscarBus";
import FormEditBus from "./UI/pages/CRUDS/Bus/FormEditBus";
import FormCreateViaje from "./UI/pages/CRUDS/Viaje/FormCreateViaje";
import SuperBuscadorViajes from "./UI/pages/CRUDS/Viaje/FormSearchViaje"
import FormEditViaje   from "./UI/pages/CRUDS/Viaje/FormEditViaje";
import ViajesEnCursoList from "./UI/pages/CRUDS/RealTime/List";
import Viewviaje from "./UI/pages/CRUDS/RealTime/View";
import ObtenerListaIncidentes from "./UI/pages/CRUDS/Incidente/FormIncidenteSearch";
import DetalleIncidenteView from "./UI/pages/CRUDS/Incidente/DetalleIncidenteView";



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

        <Route
          path="/admin/create"
          element={
            <ProtectedRoute>
              <CrearAdministrador />
            </ProtectedRoute>
          }
        />

        <Route
          path="/esp32/create"
          element={
            <ProtectedRoute>
              <FormCrearEsp32 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/esp32/searchbycode"
          element={
            <ProtectedRoute>
              <FormSearchbyCodigo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/esp32/editar/:id/:codigo"
          element={
            <ProtectedRoute>
              <FormEditEsp32 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ruta/create"
          element={
            <ProtectedRoute>
              <FormCreateRuta />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ruta/search"
          element={
            <ProtectedRoute>
              <FormBuscarRuta />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ruta/editar/:id"
          element={
            <ProtectedRoute>
              <FormEditarRuta />
            </ProtectedRoute>
          }
        />


        <Route
          path="/bus/create/"
          element={
            <ProtectedRoute>
              <FormCrearBus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bus/search/"
          element={
            <ProtectedRoute>
              <FormBuscarBus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bus/edit/:placa"
          element={
            <ProtectedRoute>
              <FormEditBus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viaje/create"
          element={
            <ProtectedRoute>
              <FormCreateViaje />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viaje/search"
          element={
            <ProtectedRoute>
              <SuperBuscadorViajes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viaje/edit/:id"
          element={
            <ProtectedRoute>
              <FormEditViaje />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viaje/todos"
          element={
            <ProtectedRoute>
              <ViajesEnCursoList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viaje/visualizar/:id_viaje"
          element={
            <ProtectedRoute>
              <Viewviaje />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incidente/todos"
          element={
            <ProtectedRoute>
              <ObtenerListaIncidentes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incidente/:id"
          element={
            <ProtectedRoute>
              <DetalleIncidenteView />
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
