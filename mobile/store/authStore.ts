import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants/storage";
import {
  authService,
  getApiErrorMessage,
  setApiAuthToken
} from "@/services/api";
import { zustandStorage } from "@/services/storage";
import type {
  AuthResult,
  AuthSession,
  LoginInput,
  RegisterInput
} from "@/types/auth";

interface AuthStore {
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  register: (input: RegisterInput) => Promise<AuthResult>;
  login: (input: LoginInput) => Promise<AuthResult>;
  refreshCurrentUser: () => Promise<AuthResult>;
  logout: () => Promise<void>;
  clearAuthData: () => void;
}

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidSession = (session: AuthSession | null): session is AuthSession => {
  if (!session) {
    return false;
  }

  return (
    hasText(session.userId) &&
    hasText(session.name) &&
    hasText(session.email) &&
    hasText(session.token) &&
    hasText(session.startedAt)
  );
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: null,
      isLoading: false,
      error: null,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
      register: async (input) => {
        set({ isLoading: true, error: null });

        try {
          const session = await authService.register(input);
          setApiAuthToken(session.token);
          set({ session, isLoading: false, error: null });

          return { success: true };
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ isLoading: false, error: message });

          return { success: false, message };
        }
      },
      login: async (input) => {
        set({ isLoading: true, error: null });

        try {
          const session = await authService.login(input);
          setApiAuthToken(session.token);
          set({ session, isLoading: false, error: null });

          return { success: true };
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ isLoading: false, error: message });

          return { success: false, message };
        }
      },
      refreshCurrentUser: async () => {
        const session = get().session;

        if (!session) {
          return {
            success: false,
            message: "No active session."
          };
        }

        set({ isLoading: true, error: null });
        setApiAuthToken(session.token);

        try {
          const user = await authService.me();
          set({
            session: {
              ...session,
              userId: user.id,
              name: user.name,
              email: user.email
            },
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ session: null, isLoading: false, error: message });
          setApiAuthToken(null);

          return { success: false, message };
        }
      },
      logout: async () => {
        setApiAuthToken(null);
        set({ session: null, isLoading: false, error: null });
      },
      clearAuthData: () => {
        setApiAuthToken(null);
        set({
          session: null,
          isLoading: false,
          error: null,
          hasHydrated: true
        });
      }
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        session: state.session
      }),
      onRehydrateStorage: () => (state) => {
        if (!state || !isValidSession(state.session)) {
          setApiAuthToken(null);
          state?.clearAuthData();

          return;
        }

        setApiAuthToken(state.session.token);
        state?.setHasHydrated(true);
      }
    }
  )
);
