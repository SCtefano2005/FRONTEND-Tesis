import {
  createAdmin,
  getAllAdmins,
  getAdminByDni,
  updateAdmin,
  deleteAdmin,
} from "../infra/adminApi";
import {
  IAdministradorCreate,
  IAdministradorResponse,
} from "../models/IAdministrador";

// 🔹 Crear administrador
export const createAdminUseCase = async (
  data: IAdministradorCreate
): Promise<IAdministradorResponse> => {
  return await createAdmin(data);
};

// 🔹 Obtener todos los administradores
export const getAllAdminsUseCase = async (): Promise<IAdministradorResponse[]> => {
  return await getAllAdmins();
};

// 🔹 Buscar administrador por DNI
export const getAdminByDniUseCase = async (
  dni: string
): Promise<IAdministradorResponse> => {
  return await getAdminByDni(dni);
};

// 🔹 Actualizar administrador
export const updateAdminUseCase = async (
  dni: string,
  data: Partial<IAdministradorCreate>
): Promise<IAdministradorResponse> => {
  return await updateAdmin(dni, data);
};

// 🔹 Eliminar administrador
export const deleteAdminUseCase = async (
  dni: string
): Promise<{ mensaje: string }> => {
  return await deleteAdmin(dni);
};
