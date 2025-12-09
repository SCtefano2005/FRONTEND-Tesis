import { obtenerIncidentes,obtenerIncidentesxId, cambiarStatusIncidente } from "../infra/incidenteApi"

import { IIncidente } from "../models/IIncidente"

export const ObtenerListaIncidentes = async (): Promise<IIncidente[]> => {
    return await obtenerIncidentes();
};

export const ObtenerIncidentePorId = async (id: string): Promise<IIncidente> => {
  return await obtenerIncidentesxId(id);
};

export const CambiarEstadoIncidente = async (id: string, estado: string) => {
  return await cambiarStatusIncidente(id, estado);
};

