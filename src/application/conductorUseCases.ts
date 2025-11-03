import { createConductor, buscarConductorPorDniApi, actualizarConductorApi, eliminarConductorApi, buscarConductorPorIdApi } from "../infra/conductorApi";
import { IConductor } from "../models/IConductor";
import { IConductorResponse, IResumenConductor } from "../models/IConductorResponse";

// Caso de uso: crear conductor
export const createConductorUseCase = async (data: IConductor) => {
  return await createConductor(data);
};

// Caso de uso: buscar conductor por DNI
export const buscarConductorPorDniUseCase = async (
  dni: string
): Promise<IConductorResponse> => {
  const response = await buscarConductorPorDniApi(dni);
  // aseguramos que tenga la estructura completa
  const result: IConductorResponse = {
    usuario: response.usuario,
    conductor: response.conductor,
  };
  return result;
};

// 🔹 Use case para obtener conductor por ID
export const buscarConductorPorIdUseCase = async (id: string): Promise<IResumenConductor> => {
  try {
    const conductor = await buscarConductorPorIdApi(id);
    return conductor;
  } catch (error: any) {
    console.error("Error en buscarConductorPorIdUseCase:", error);
    throw new Error(error?.message || "Error al buscar el conductor por ID");
  }
};


// Caso de uso: actualizar conductor
export const actualizarConductorUseCase = async (
  dni: string,
  data: Partial<IConductor>
) => {
  return await actualizarConductorApi(dni, data);
};

// Caso de uso: eliminar conductor
export const eliminarConductorUseCase = async (dni: string) => {
  return await eliminarConductorApi(dni);
};

