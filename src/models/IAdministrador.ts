export interface IAdministrador {
  id: string;
  identificacion: string;
  nombres: string;
  apellidos: string;
  email: string;
  area: string;
  nivel: "superadmin" | "admin_local";
  permisos: string[];
  token: string;
}


export interface IAdministradorResponse {
  mensaje: string;
  usuario: {
    usuario: {
      identificacion: string;
      password_hash: string;
      rol: "admin";
      estado: "activo" | "inactivo";
      datos_personal: {
        nombres: string;
        apellidos: string;
        email: string;
        telefono: string;
        direccion: string;
      };
      config_sesion: {
        notificaciones: boolean;
        tema: "oscuro" | "claro";
      };
      _id: string;
      creado_en: string;
      actualizado: string;
      __v?: number;
    };
    admin: {
      usuario_id: string;
      permisos: string[];
      area: string;
      nivel: "superadmin" | "admin_local";
      creado_en: string;
      actualizado: string;
      _id: string;
      __v?: number;
    };
  };
}


export interface IAdministradorCreate {
  identificacion: string;
  password: string;
  rol?: "admin";
  estado?: "activo" | "inactivo";
  datos_personal: {
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  config_sesion?: {
    notificaciones?: boolean;
    tema?: "oscuro" | "claro";
  };
  administrador: {
    area: string;
    nivel: "superadmin" | "admin_local";
    permisos?: string[];
  };
}

