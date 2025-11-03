import {
  createBus,
  getBusByPlaca,
  updateBus,
  deleteBus,
  getBusById
} from "../infra/busApi";

import { IBus, IBusResponse } from "../models/IBus";

// 🔹 Caso de uso: crear un nuevo bus
export const createBusUseCase = async (data: IBus): Promise<IBusResponse> => {
  return await createBus(data);
};

// 🔹 Caso de uso: obtener un bus por placa
export const getBusByPlacaUseCase = async (placa: string): Promise<IBusResponse> => {
  return await getBusByPlaca(placa);
};

export const getBusByIdUseCase = async (id: string): Promise<IBusResponse> => {
  return await getBusByPlaca(id);
};

// 🔹 Caso de uso: actualizar un bus por placa
export const updateBusUseCase = async (
  placa: string,
  data: Partial<IBus>
): Promise<IBusResponse> => {
  return await updateBus(placa, data);
};

// 🔹 Caso de uso: eliminar un bus por placa
export const deleteBusUseCase = async (placa: string): Promise<{ message: string }> => {
  return await deleteBus(placa);
};
