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
  // Default to false for security, but allow mock session toggle
  isAuthenticated: false,
  user: null,
  login: (email, name = "Inspector Desai", role = "Command Group") => {
    set({
      isAuthenticated: true,
      user: { name, email, role },
    });
  },
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
    });
  },
  register: (name, email, role) => {
    set({
      isAuthenticated: true,
      user: { name, email, role },
    });
  },
}));
