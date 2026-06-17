import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants/storage";
import { zustandStorage } from "@/services/storage";
import type { ThemeMode } from "@/types/settings";

interface SettingsStore {
  themeMode: ThemeMode;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  toggleThemeMode: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      themeMode: "light",
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
      setThemeMode: (themeMode) => {
        set({ themeMode });
      },
      toggleThemeMode: () => {
        set({ themeMode: get().themeMode === "dark" ? "light" : "dark" });
      },
      resetSettings: () => {
        set({
          themeMode: "light",
          hasHydrated: true
        });
      }
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        themeMode: state.themeMode
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
