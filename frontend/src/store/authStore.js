import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (tokens, user) => 
        set({ 
          accessToken: tokens.access, 
          refreshToken: tokens.refresh, 
          user, 
          isAuthenticated: true 
        }),

      logout: () => 
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false 
        }),

      updateUser: (user) => 
        set((state) => ({ 
          user: { ...state.user, ...user } 
        })),
    }),
    {
      name: 'funkidz-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
