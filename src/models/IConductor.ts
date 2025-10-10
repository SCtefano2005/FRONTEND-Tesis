export interface IDocumento {
  nombre: string;
  url: string;
  vence: string; // ISO date string
}

export interface IExperiencia {
  anios: number;
  historial: string[];
}

export interface IConductorDetalle {
  numero_licencia: string;
  categoria_lic: string;
  estado_conduct: string;
  documentos: IDocumento[];
  experiencia: IExperiencia;
}

export interface IDatosPersonal {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface IConfigSesion {
  notificaciones: boolean;
  tema: string;
}

export interface IConductor {
  identificacion: string;
  password: string;
  rol: "conductor";
  estado: "activo" | "inactivo";
  datos_personal: IDatosPersonal;
  config_sesion: IConfigSesion;
  conductor: IConductorDetalle;
}
