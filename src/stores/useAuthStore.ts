// src/stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IAdministrador } from "../models/IAdministrador";

interface AuthState {
  token: string | null;
  perfil: IAdministrador | null;
  setAuth: (token: string, perfil: IAdministrador) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      perfil: null,
      setAuth: (token, perfil) => set({ token, perfil }),
      clearAuth: () => set({ token: null, perfil: null }),
    }),
    {
      name: "auth-storage", // se guarda en localStorage
    }
  )
);
