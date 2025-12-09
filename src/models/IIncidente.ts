// ✅ Para la lista
export interface IIncidente {
  _id: string;
  tipo: string;
  estado: string;

  ubicacion: {
    lat: number;
    lng: number;
  };

  UsuarioConductorId: {
    identificacion: string;
    nombreyapellido: string;
    telefono: string;
  };

  timestamp: string;
}

// ✅ Para el detalle (respuesta real del backend)
export interface IIncidenteResponse {
  _id: string;

  UsuarioConductorID: {
    datos_personal: {
      nombres: string;
      apellidos: string;
      email: string;
      telefono: string;
      direccion: string;
    };
    config_sesion: {
      notificaciones: boolean;
      tema: string;
    };
    _id: string;
    identificacion: string;
    password_hash: string;
    rol: string;
    estado: string;
    creado_en: string;
    actualizado: string;
    __v: number;
  };

  Descripcion: string;
  tipo: string;
  estado: string;

  latitud: number;
  longitud: number;

  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
