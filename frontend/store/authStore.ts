import { create } from "zustand";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, name?: string, role?: string) => void;
  logout: () => void;
  register: (name: string, email: string, role: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Default to true since signing system is removed
  isAuthenticated: true,
  user: { name: "Inspector Desai", email: "desai@karnataka.gov.in", role: "Command Group" },
  login: (email, name = "Inspector Desai", role = "Command Group") => {
    set({
      isAuthenticated: true,
      user: { name, email, role },
    });
  },
  logout: () => {
    // No-op since authentication system is removed
  },
  register: (name, email, role) => {
    set({
      isAuthenticated: true,
      user: { name, email, role },
    });
  },
}));
