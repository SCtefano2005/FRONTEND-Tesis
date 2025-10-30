// src/infra/conductorApi.ts
import axios from "axios";
import { IConductor } from "../models/IConductor";
import { getToken } from "../application/authUseCases";
import { IConductorResponse } from "../models/IConductorResponse";

const API_URL = "https://backend-tesis-jvfm.onrender.com/api/conductor";

export const createConductor = async (conductorData: IConductor) => {
  const token = getToken();
  console.log("🔑 Token usado en createConductor:", token);
  if (!token) throw new Error("No hay token disponible");

  const response = await axios.post(`${API_URL}/conductores`, conductorData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const buscarConductorPorDniApi = async (dni: string): Promise<IConductorResponse> => {
  const token = getToken();
  if (!token) throw new Error("No hay token disponible");

  const { data } = await axios.get<IConductorResponse>(`${API_URL}/conductores/${dni}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Actualizar conductor por DNI
export const actualizarConductorApi = async (
  dni: string,
  data: Partial<IConductor> // Permitimos actualizar solo campos específicos
) => {
  const token = getToken();
  if (!token) throw new Error("No hay token disponible");

  const response = await axios.put(`${API_URL}/conductores/${dni}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Eliminar conductor por DNI
export const eliminarConductorApi = async (dni: string) => {
  const token = getToken();
  if (!token) throw new Error("No hay token disponible");

  const response = await axios.delete(`${API_URL}/conductores/${dni}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
