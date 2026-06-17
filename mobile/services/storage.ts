import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StateStorage } from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants/storage";

export const zustandStorage: StateStorage = {
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: (name, value) => AsyncStorage.setItem(name, value),
  removeItem: (name) => AsyncStorage.removeItem(name)
};

export const clearAppStorage = async (): Promise<void> => {
  await Promise.all([
    AsyncStorage.removeItem(STORAGE_KEYS.auth),
    AsyncStorage.removeItem(STORAGE_KEYS.tasks),
    AsyncStorage.removeItem(STORAGE_KEYS.settings)
  ]);
};
