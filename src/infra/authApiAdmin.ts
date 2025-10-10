// src/infra/authApiAdmin.ts
import axios from "axios";

const API_URL = "https://backend-tesis-jvfm.onrender.com/api/auth/login/admin";

interface LoginResponse {
  token: string;
  perfil: any;
}

export const loginAdmin = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    API_URL,
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
