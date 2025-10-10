import { createConductor, buscarConductorPorDniApi, actualizarConductorApi } from "../infra/conductorApi";
import { IConductor } from "../models/IConductor";
import { IConductorResponse } from "../models/IConductorResponse"

// Caso de uso: crear conductor
export const createConductorUseCase = async (data: IConductor) => {
  return await createConductor(data);

};
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

export const actualizarConductorUseCase = async (
  dni: string,
  data: Partial<IConductor>
) => {
  return await actualizarConductorApi(dni, data);
};

