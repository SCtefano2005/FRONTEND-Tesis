// src/models/IConductorResponse.ts
import { IConductorDetalle, IDatosPersonal, IConfigSesion } from "./IConductor";

export interface IUsuario {
  _id: string;
  identificacion: string;
  rol: "conductor" | string;
  estado: "activo" | "inactivo";
  datos_personal: IDatosPersonal;
  config_sesion: IConfigSesion;
  creado_en: string;
  actualizado: string;
  __v: number;
}

export interface IConductorResponse {
  usuario: IUsuario;
  conductor: IConductorDetalle;
}

export interface IResumenConductor {
  dni: string;
  numero_licencia: string;
  nombre: string;
}
