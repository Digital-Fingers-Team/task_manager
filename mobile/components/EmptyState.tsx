import { StyleSheet, View } from "react-native";
import { Avatar, Button, Text, useTheme } from "react-native-paper";

import { spacing } from "@/theme";

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon,
  title,
  message,
  actionLabel,
  onAction
}: EmptyStateProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Avatar.Icon
        icon={icon}
        size={72}
        color={theme.colors.primary}
        style={{ backgroundColor: theme.colors.primaryContainer }}
      />
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
      >
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Button mode="contained" onPress={onAction} style={styles.action}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.sm
  },
  title: {
    marginTop: spacing.sm,
    textAlign: "center"
  },
  message: {
    maxWidth: 280,
    textAlign: "center"
  },
  action: {
    marginTop: spacing.md
  }
});
