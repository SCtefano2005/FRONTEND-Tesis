export interface IEsp32Create {
  codigo: string;        // Ej. "ESP32-ABC123" o dirección MAC
  descripcion?: string;  // Opcional
  activo?: boolean;      // Por defecto true, si no lo envías
}

export interface IEsp32Response {
  _id: string;
  codigo: string;
  descripcion?: string;
  activo: boolean;
  registrado_en: string; // ISO string date
  actualizado: string;   // ISO string date
  __v?: number;          // Mongoose version key
}