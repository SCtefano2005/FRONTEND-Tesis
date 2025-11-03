import {
  createRuta,
  getAllRutas,
  updateRuta,
  deleteRuta,
  getRutaById
} from "../infra/rutaApi";
import { IRuta , IRutaResponse} from "../models/IRuta";

// 🔹 Caso de uso: crear una nueva ruta
export const createRutaUseCase = async (data: IRuta): Promise<IRuta> => {
  return await createRuta(data);
};

// 🔹 Caso de uso: obtener todas las rutas o buscar por nombre
export const getAllRutasUseCase = async (): Promise<IRutaResponse[]> => {
  const rutas = await getAllRutas();
  return rutas;
};

// Caso de uso buscar by id
export const getRutaByIdUseCase = async (id: string): Promise<IRutaResponse> => {
  try {
    const ruta = await getRutaById(id);
    return ruta;
  } catch (error: any) {
    console.error("❌ Error al obtener la ruta por ID:", error.message);
    throw new Error(error.response?.data?.mensaje || "Error al obtener la ruta");
  }
};


// 🔹 Caso de uso: actualizar una ruta por ID
export const updateRutaUseCase = async (
  id: string,
  data: Partial<IRuta>
): Promise<IRuta> => {
  return await updateRuta(id, data);
};

// 🔹 Caso de uso: eliminar una ruta por ID
export const deleteRutaUseCase = async (id: string) => {
  return await deleteRuta(id);
};

