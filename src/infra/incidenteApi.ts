import axios from  "axios";
import { getToken } from "../application/authUseCases";
import { IIncidente, IIncidenteResponse } from "../models/IIncidente";

const API_URL = "https://backend-tesis-jvfm.onrender.com/api/incidente/"


export const obtenerIncidentes = async (): Promise<IIncidente[]> => {
  try {
    const token = await getToken();

    const { data } = await axios.get<IIncidente[]>(
      API_URL,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return data;

  } catch (error: any) {
    console.error("Error al obtener incidentes:", error);
    throw new Error(
      error?.response?.data?.message || "Error al obtener incidentes"
    );
  }
};

export const obtenerIncidentesxId = async (id: string): Promise<IIncidenteResponse> => {
  try {
    const token = await getToken();

    const { data } = await axios.get<IIncidenteResponse>(
      `${API_URL}get/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return data;

  } catch (error: any) {
    console.error("Error al obtener incidente por ID:", error);
    throw new Error(error?.response?.data?.message || "Error al obtener incidente");
  }
};

export const cambiarStatusIncidente = async (id: string, estado: string) => {
  try {
    const token = await getToken();

    const response = await axios.post(
      `${API_URL}cambiarestado`,
      { id, estado },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error: any) {

    const backendMsg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Error al cambiar estado del incidente";

    console.error("⚠️ Error cambiarStatusIncidente:", {
        status: error?.response?.status,
        url: error?.config?.url,
        payload: error?.config?.data,
        backendMsg,
    });

    throw new Error(backendMsg);
  }
};
