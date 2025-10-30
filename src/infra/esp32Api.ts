import axios from "axios";
import { IEsp32Create, IEsp32Response } from "../models/IEsp32";
import { getToken } from "../application/authUseCases";

const API_URL = "https://backend-tesis-jvfm.onrender.com/api/esp32";

// 🔹 Crear un nuevo ESP32
export const createEsp32 = async (data: IEsp32Create): Promise<IEsp32Response> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.post(`${API_URL}/crear`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// 🔹 Obtener todos los ESP32 registrados
export const getAllEsp32 = async (): Promise<IEsp32Response[]> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.get(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 🔹 Obtener un ESP32 por su ID
export const getEsp32ById = async (id: string): Promise<IEsp32Response> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 🔹 Actualizar un ESP32 existente
export const updateEsp32 = async (
  id: string,
  data: Partial<IEsp32Create>
): Promise<IEsp32Response> => {
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

// 🔹 Eliminar un ESP32
export const deleteEsp32 = async (id: string): Promise<{ mensaje: string }> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
