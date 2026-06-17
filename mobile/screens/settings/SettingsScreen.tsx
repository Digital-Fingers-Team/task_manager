import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Button,
  Card,
  Divider,
  List,
  SegmentedButtons,
  Text,
  useTheme
} from "react-native-paper";

import { CategoryManager } from "@/components/CategoryManager";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useCurrentUserData } from "@/hooks/useCurrentUserData";
import { ROUTES } from "@/navigation/routes";
import { resetApplicationData } from "@/services/reset";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { spacing } from "@/theme";
import type { ThemeMode } from "@/types/settings";

export const SettingsScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const { session, categories, tasks } = useCurrentUserData();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const logout = useAuthStore((state) => state.logout);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const [isClearVisible, setClearVisible] = useState(false);
  const [isClearing, setClearing] = useState(false);

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.replace(ROUTES.login);
  };

  const handleClearAllData = async () => {
    setClearing(true);

    try {
      await resetApplicationData();
      router.replace(ROUTES.login);
    } finally {
      setClearing(false);
      setClearVisible(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Settings
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {session.email}
        </Text>
      </View>

      <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title="Appearance" subtitle="Choose your preferred theme" />
        <Card.Content>
          <SegmentedButtons
            value={themeMode}
            onValueChange={(value) => {
              setThemeMode(value as ThemeMode);
            }}
            buttons={[
              {
                value: "light",
                label: "Light",
                icon: "white-balance-sunny"
              },
              {
                value: "dark",
                label: "Dark",
                icon: "moon-waning-crescent"
              }
            ]}
          />
        </Card.Content>
      </Card>

      <CategoryManager userId={session.userId} categories={categories} />

      <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title="Account" subtitle={session.name} />
        <Card.Content>
          <List.Item
            title="Local tasks"
            description={`${tasks.length} saved on this device`}
            left={(props) => <List.Icon {...props} icon="database-outline" />}
          />
          <Divider />
          <List.Item
            title="Mock authentication"
            description="No backend connection is used"
            left={(props) => <List.Icon {...props} icon="shield-check-outline" />}
          />
          <Button
            mode="outlined"
            icon="logout"
            loading={isAuthLoading}
            disabled={isAuthLoading}
            onPress={handleLogout}
            style={styles.accountButton}
          >
            Logout
          </Button>
        </Card.Content>
      </Card>

      <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title="Storage" subtitle="Local app data" />
        <Card.Content style={styles.storageContent}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Clear accounts, sessions, tasks, categories, and preferences from this device.
          </Text>
          <Button
            mode="contained-tonal"
            icon="trash-can-outline"
            textColor={theme.colors.error}
            onPress={() => {
              setClearVisible(true);
            }}
          >
            Clear all data
          </Button>
        </Card.Content>
      </Card>

      <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title="About" subtitle="Task Manager 1.0.0" />
        <Card.Content>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            A local-first Expo task manager built with TypeScript, Expo Router,
            Zustand, AsyncStorage, React Native Paper, React Hook Form, and Zod.
          </Text>
        </Card.Content>
      </Card>

      <ConfirmDialog
        visible={isClearVisible}
        title="Clear all data"
        message="All local accounts, tasks, categories, and settings will be deleted."
        confirmLabel="Clear"
        isDestructive
        loading={isClearing}
        onDismiss={() => {
          setClearVisible(false);
        }}
        onConfirm={handleClearAllData}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginBottom: spacing.lg
  },
  title: {
    fontWeight: "800"
  },
  card: {
    borderRadius: 18,
    marginBottom: spacing.md
  },
  accountButton: {
    marginTop: spacing.md
  },
  storageContent: {
    gap: spacing.md
  }
});
