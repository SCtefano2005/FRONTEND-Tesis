import axios from "axios";
import { IBus, IBusResponse } from "../models/IBus";
import { getToken } from "../application/authUseCases";

const API_URL = "https://backend-tesis-jvfm.onrender.com/api/bus";

// 🔹 Crear un nuevo bus
export const createBus = async (data: IBus): Promise<IBusResponse> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.post(`${API_URL}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data as IBusResponse;
};

// 🔹 Buscar bus por placa
export const getBusByPlaca = async (placa: string): Promise<IBusResponse> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.get(`${API_URL}/${placa}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as IBusResponse;
};


export const getBusById = async (id: string): Promise<IBusResponse> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.get(`${API_URL}/id/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data as IBusResponse;
};

// 🔹 Editar bus por placa
export const updateBus = async (
  placa: string,
  data: Partial<IBus>
): Promise<IBusResponse> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.put(`${API_URL}/${placa}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data as IBusResponse;
};

// 🔹 Eliminar bus por placa
export const deleteBus = async (placa: string): Promise<{ message: string }> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.delete(`${API_URL}/${placa}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
