import "react-native-gesture-handler";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ErrorBoundaryProps } from "expo-router";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, PaperProvider, Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/useAppTheme";
import { spacing } from "@/theme";

type MaterialIconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export const ErrorBoundary = ({ error, retry }: ErrorBoundaryProps) => (
  <GestureHandlerRootView style={styles.root}>
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar style="dark" />
        <View style={styles.errorScreen}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={42}
            color="#DC2626"
          />
          <Text variant="titleMedium">Something went wrong</Text>
          <Text variant="bodyMedium" style={styles.errorMessage}>
            {error.message}
          </Text>
          <Button mode="contained" onPress={retry}>
            Try again
          </Button>
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

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
          <Stack screenOptions={{ headerShown: false }} />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  errorScreen: {
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
    padding: spacing.lg
  },
  errorMessage: {
    textAlign: "center"
  }
});
