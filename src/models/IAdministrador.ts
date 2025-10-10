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
