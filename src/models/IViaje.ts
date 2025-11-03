export interface IViajeResponse {
  _id: string;
  creado_por: {
    _id: string;
    nombre: string;
    email: string;
    rol: string;
  };
  conductor_id: {
    datos_personal: {
      id: string;
      nombres: string;
      apellidos: string;
      numero_licencia: string;
      categoria_lic: string;
    };
  };
  bus_id: {
    _id: string;
    placa: string;
    modelo: string;
    capacidad: number;
    estado: string;
  };
  ruta_id: {
    _id: string;
    nombre: string;
    distancia_km: number;
    duracion_estimada: string;
  };
  origen: string;
  destino: string;
  fecha_salida: string;     // Se recibe como string (ISO)
  fecha_llegada: string;
  estado: "pendiente" | "en_curso" | "finalizado" | "cancelado";
  creado_en?: string;
  actualizado?: string;
}


export interface IViajeCreate {
  creador_email: string; // email del admin que crea el viaje
  conductor_dni: string;    // DNI o número de licencia del conductor
  bus_placa: string;        // placa del bus
  ruta_nombre: string;      // nombre de la ruta
  origen: string;
  destino: string;
  fecha_salida: string;     // ISO string
  fecha_llegada: string;    // ISO string
}

export interface IviajeEdit {
  creador_email: string; // email del admin que crea el viaje
  conductor_dni: string;    // DNI o número de licencia del conductor
  bus_placa: string;        // placa del bus
  ruta_nombre: string;      // nombre de la ruta
  origen: string;
  destino: string;
  fecha_salida: string;     // ISO string
  fecha_llegada: string; 
  estado: "pendiente" | "en_curso" | "finalizado" | "cancelado";
}
