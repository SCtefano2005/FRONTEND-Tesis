// src/application/authUseCases.ts
import { loginAdmin } from "../infra/authApiAdmin";
import { IAdministrador } from "../models/IAdministrador";
import { useAuthStore } from "../stores/useAuthStore";

export const loginAdminUseCase = async (
  email: string,
  password: string
): Promise<IAdministrador> => {
  const data = await loginAdmin(email, password);
  console.log("Respuesta login API:", data);

  // Guardamos en Zustand
  useAuthStore.getState().setAuth(data.token, data.perfil);

  console.log("✅ Token guardado en Zustand:", data.token);

  return data.perfil;
};

// Getter del token desde Zustand
export const getToken = (): string | null => {
  const token = useAuthStore.getState().token;
  console.log("📦 getToken (zustand):", token);
  return token;
};


