// src/application/viajeUseCases.ts
import {
  createViaje,
  getViajeById,
  updateViaje,
  deleteViaje,
  listViajes,
  getViajesByConductor,
  getViajesByBus,
  getViajesByRuta,
  listViajesEncurso
} from "../infra/viajeApi";
import { IViajeCreate, IviajeEdit, IViajeResponse } from "../models/IViaje";

// 🔹 Caso de uso: crear un nuevo viaje
export const createViajeUseCase = async (data: IViajeCreate): Promise<IViajeResponse> => {
  return await createViaje(data);
};

// 🔹 Caso de uso: obtener todos los viajes
export const listViajesUseCase = async (): Promise<IViajeResponse[]> => {
  return await listViajes();
};

// es para usar en los rooms de socket io
export const listViajesEncursousecase = async (): Promise<IViajeResponse[]> => {
  return await listViajesEncurso();
};

// 🔹 Caso de uso: buscar un viaje por ID
export const getViajeByIdUseCase = async (id: string): Promise<IViajeResponse> => {
  try {
    return await getViajeById(id);
  } catch (error: any) {
    console.error("❌ Error al obtener el viaje por ID:", error.message);
    throw new Error(error.response?.data?.mensaje || "Error al obtener el viaje");
  }
};

// 🔹 Caso de uso: actualizar un viaje por ID
export const updateViajeUseCase = async (
  id: string,
  data: Partial<IviajeEdit>
): Promise<IViajeResponse> => {
  return await updateViaje(id, data);
};

// 🔹 Caso de uso: eliminar un viaje por ID
export const deleteViajeUseCase = async (id: string) => {
  return await deleteViaje(id);
};

// 🔹 Caso de uso: buscar viajes por DNI de conductor
export const getViajesByConductorUseCase = async (dni: string): Promise<IViajeResponse[]> => {
  return await getViajesByConductor(dni);
};

// 🔹 Caso de uso: buscar viajes por placa de bus
export const getViajesByBusUseCase = async (placa: string): Promise<IViajeResponse[]> => {
  return await getViajesByBus(placa);
};

// 🔹 Caso de uso: buscar viajes por nombre de ruta
export const getViajesByRutaUseCase = async (nombre: string): Promise<IViajeResponse[]> => {
  return await getViajesByRuta(nombre);
};
