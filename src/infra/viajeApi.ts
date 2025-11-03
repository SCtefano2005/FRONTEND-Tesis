// src/api/viajeApi.ts
import axios from "axios";
import { getToken } from "../application/authUseCases";
import { IViajeCreate, IviajeEdit, IViajeResponse } from "../models/IViaje";

const API_URL = "https://backend-tesis-jvfm.onrender.com/api/viaje";

// 🔹 Crear un nuevo viaje
export const createViaje = async (data: IViajeCreate): Promise<IViajeResponse> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.post(`${API_URL}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data as IViajeResponse;
};

// 🔹 Buscar viaje por ID
export const getViajeById = async (id: string): Promise<IViajeResponse> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.get(`${API_URL}/id/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data as IViajeResponse;
};

// 🔹 Editar viaje por ID
export const updateViaje = async (
  id: string,
  data: Partial<IviajeEdit>
): Promise<IViajeResponse> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data as IViajeResponse;
};

// 🔹 Eliminar viaje por ID
export const deleteViaje = async (id: string): Promise<{ message: string }> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// 🔹 Listar todos los viajes
export const listViajes = async (): Promise<IViajeResponse[]> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.get(`${API_URL}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data as IViajeResponse[];
};

// 🔹 Buscar viajes por DNI de conductor
export const getViajesByConductor = async (dni: string): Promise<IViajeResponse[]> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.get(`${API_URL}/conductor/${dni}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data as IViajeResponse[];
};

// 🔹 Buscar viajes por placa de bus
export const getViajesByBus = async (placa: string): Promise<IViajeResponse[]> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.get(`${API_URL}/bus/${placa}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data as IViajeResponse[];
};

// 🔹 Buscar viajes por nombre de ruta
export const getViajesByRuta = async (nombre: string): Promise<IViajeResponse[]> => {
  const token = getToken();
  if (!token) throw new Error("No hay token de autenticación");

  const response = await axios.get(`${API_URL}/ruta/${nombre}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data as IViajeResponse[];
};
