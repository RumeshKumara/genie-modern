import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@clerk/clerk-react';

interface AuthState {
  user: User | null;
  isSignedIn: boolean;
  setUser: (user: User | null) => void;
  setSignedIn: (isSignedIn: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isSignedIn: false,
      setUser: (user) => set({ user }),
      setSignedIn: (isSignedIn) => set({ isSignedIn }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isSignedIn: state.isSignedIn 
      }),
    }
  )
);