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

  timestamp: string; // opcional si lo usas
}
