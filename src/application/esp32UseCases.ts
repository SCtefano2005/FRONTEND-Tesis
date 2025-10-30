import {
  createEsp32,
  getAllEsp32,
  getEsp32ById,
  updateEsp32,
  deleteEsp32,
} from "../infra/esp32Api";
import { IEsp32Create, IEsp32Response } from "../models/IEsp32";


// 🔹 Caso de uso: crear un nuevo ESP32
export const createEsp32UseCase = async (data: IEsp32Create): Promise<IEsp32Response> => {
  return await createEsp32(data);
};

// 🔹 Caso de uso: obtener todos los ESP32
export const getAllEsp32UseCase = async (): Promise<IEsp32Response[]> => {
  return await getAllEsp32();
};

// 🔹 Caso de uso: obtener un ESP32 por ID
export const getEsp32ByIdUseCase = async (id: string): Promise<IEsp32Response> => {
  return await getEsp32ById(id);
};

// 🔹 Caso de uso: actualizar un ESP32
export const updateEsp32UseCase = async (
  id: string,
  data: Partial<IEsp32Create>
): Promise<IEsp32Response> => {
  return await updateEsp32(id, data);
};

// 🔹 Caso de uso: eliminar un ESP32
export const deleteEsp32UseCase = async (id: string): Promise<{ mensaje: string }> => {
  return await deleteEsp32(id);
};
