import { useMemo } from "react";

import { darkTheme, lightTheme } from "@/theme";
import { useSettingsStore } from "@/store/settingsStore";

export const useAppTheme = () => {
  const themeMode = useSettingsStore((state) => state.themeMode);

  return useMemo(
    () => ({
      theme: themeMode === "dark" ? darkTheme : lightTheme,
      isDark: themeMode === "dark"
    }),
    [themeMode]
  );
};
