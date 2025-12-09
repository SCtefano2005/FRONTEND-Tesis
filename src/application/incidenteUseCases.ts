import { obtenerIncidentes,obtenerIncidentesxId, cambiarStatusIncidente } from "../infra/incidenteApi"

import { IIncidente, IIncidenteResponse } from "../models/IIncidente"

export const ObtenerListaIncidentes = async (): Promise<IIncidente[]> => {
    return await obtenerIncidentes();
};



export const ObtenerIncidentePorId = async (id: string): Promise<IIncidenteResponse> => {
  return await obtenerIncidentesxId(id);
};


export const CambiarEstadoIncidente = async (id: string, estado: string) => {
  return await cambiarStatusIncidente(id, estado);
};

