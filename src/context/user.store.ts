import { create } from 'zustand';
import { User } from '@types';
import { authService } from '@/services/auth.service';

interface UserStore {
  user: User | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    gender: 'male' | 'female',
    age: number,
    equipment?: string[]
  ) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  isInitializing: true,
  error: null,

  setUser: (user: User | null) =>
    set({ user, error: null }),

  setError: (error: string | null) =>
    set({ error }),

  initialize: async () => {
    set({ isInitializing: true });
    try {
      const currentUser = await authService.getCurrentUser();
      set({ user: currentUser });
    } catch (err: any) {
      console.warn('Errore inizializzazione sessione:', err);
    } finally {
      set({ isInitializing: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const loggedUser = await authService.signIn(email, password);
      set({ user: loggedUser, error: null });
    } catch (err: any) {
      set({ error: err.message || 'Errore durante il login' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, name, gender, age, equipment = []) => {
    set({ isLoading: true, error: null });
    try {
      const registeredUser = await authService.signUp(
        email,
        password,
        name,
        gender,
        age,
        equipment
      );
      set({ user: registeredUser, error: null });
    } catch (err: any) {
      set({ error: err.message || 'Errore durante la registrazione' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  loginAsGuest: async () => {
    set({ isLoading: true, error: null });
    try {
      const guestUser = await authService.signInAsGuest();
      set({ user: guestUser, error: null });
    } catch (err: any) {
      set({ error: err.message || 'Errore durante il login come ospite' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      set({ user: null, error: null });
    } catch (err: any) {
      console.warn('Errore durante il logout, svuoto comunque lo stato locale:', err);
      set({ user: null, error: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
