// stores/authStore.ts
import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  id: number;
  username: string;
  role: string;
  // Add other user properties if needed
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(Cookies.get("user") || "null"),
  isLoading: false, // Initialize loading state as false
  setUser: (user) => {
    Cookies.set("user", JSON.stringify(user));
    set({ user, isLoading: false });
  },
  logout: () => {
    Cookies.remove("user");
    set({ user: null, isLoading: false }); // Update loading state on logout
  },
  setLoading: (loading) => set({ isLoading: loading }),
}));

export default useAuthStore;
