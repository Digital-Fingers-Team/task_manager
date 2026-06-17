import { clearAppStorage } from "@/services/storage";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTaskStore } from "@/store/taskStore";

export const resetApplicationData = async (): Promise<void> => {
  await clearAppStorage();
  useTaskStore.getState().clearAllTaskData();
  useSettingsStore.getState().resetSettings();
  useAuthStore.getState().clearAuthData();
};
