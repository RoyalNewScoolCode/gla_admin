import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  country: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', token);
          localStorage.setItem('auth-user', JSON.stringify(user));
          document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
        }
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
          localStorage.removeItem('auth-user');
          document.cookie = 'token=; path=/; max-age=0; samesite=lax';
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return {
          getItem: (name) => {
            const token = localStorage.getItem('auth-token');
            const user = localStorage.getItem('auth-user');
            if (token && user) {
              return JSON.stringify({
                state: {
                  token,
                  user: JSON.parse(user),
                  isAuthenticated: true,
                },
              });
            }
            return null;
          },
          setItem: (name, value) => {
            try {
              const parsed = JSON.parse(value);
              if (parsed.state?.token) {
                localStorage.setItem('auth-token', parsed.state.token);
              }
              if (parsed.state?.user) {
                localStorage.setItem('auth-user', JSON.stringify(parsed.state.user));
              }
            } catch (e) {
              // Silent fail
            }
          },
          removeItem: () => {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('auth-user');
          },
        };
      }),
    }
  )
);
