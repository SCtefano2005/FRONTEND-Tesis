//adminApi.ts
import axios from "axios";
import { IAdministradorCreate, IAdministradorResponse } from "../models/IAdministrador";

const API_URL = "https://backend-tesis-jvfm.onrender.com/api/administrador/administradores";

// 🔹 Crear administrador
export const createAdmin = async (data: IAdministradorCreate): Promise<IAdministradorResponse> => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// 🔹 Obtener todos los administradores
export const getAllAdmins = async (): Promise<IAdministradorResponse[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 🔹 Buscar administrador por DNI
export const getAdminByDni = async (dni: string): Promise<IAdministradorResponse> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/${dni}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 🔹 Actualizar administrador
export const updateAdmin = async (
  dni: string,
  data: Partial<IAdministradorCreate>
): Promise<IAdministradorResponse> => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/${dni}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// 🔹 Eliminar administrador
export const deleteAdmin = async (dni: string): Promise<{ mensaje: string }> => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API_URL}/${dni}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
