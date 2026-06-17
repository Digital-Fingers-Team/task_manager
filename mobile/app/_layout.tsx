import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, PaperProvider, Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTaskStore } from "@/store/taskStore";
import { spacing } from "@/theme";

type MaterialIconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const RootNavigator = () => {
  const authHydrated = useAuthStore((state) => state.hasHydrated);
  const taskHydrated = useTaskStore((state) => state.hasHydrated);
  const settingsHydrated = useSettingsStore((state) => state.hasHydrated);

  if (!authHydrated || !taskHydrated || !settingsHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
        <Text variant="bodyMedium">Loading workspace</Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
  const { theme, isDark } = useAppTheme();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <PaperProvider
          theme={theme}
          settings={{
            icon: ({ name, color, size }) => (
              <MaterialCommunityIcons
                name={String(name) as MaterialIconName}
                color={color}
                size={size}
              />
            )
          }}
        >
          <StatusBar style={isDark ? "light" : "dark"} />
          <RootNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  loading: {
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
    justifyContent: "center"
  }
});
