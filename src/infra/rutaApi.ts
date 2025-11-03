import axios from "axios";
import { IRuta, IRutaResponse } from "../models/IRuta";
import { getToken } from "../application/authUseCases";

const API_URL = "https://backend-tesis-jvfm.onrender.com/api/rutas";

// 🔹 Crear una nueva Ruta
export const createRuta = async (data: IRuta): Promise<IRuta> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.post(`${API_URL}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// 🔹 Obtener todas las rutas o filtrar por nombre
// 🔹 Obtener todas las rutas
export const getAllRutas = async (): Promise<IRutaResponse[]> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data as IRutaResponse[];
};

export const getRutaById = async (id: string): Promise<IRutaResponse> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data as IRutaResponse;
};


// 🔹 Actualizar una ruta por ID
export const updateRuta = async (
  id: string,
  data: Partial<IRuta>
): Promise<IRuta> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// 🔹 Eliminar una ruta por ID
export const deleteRuta = async (id: string): Promise<{ message: string }> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
