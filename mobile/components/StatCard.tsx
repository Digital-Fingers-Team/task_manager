import { StyleSheet, View } from "react-native";
import { Avatar, Card, Text, useTheme } from "react-native-paper";

import { spacing } from "@/theme";

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  accentColor?: string;
}

export const StatCard = ({ label, value, icon, accentColor }: StatCardProps) => {
  const theme = useTheme();
  const color = accentColor ?? theme.colors.primary;

  return (
    <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
          <Avatar.Icon size={36} icon={icon} color={color} style={styles.avatar} />
        </View>
        <Text variant="headlineSmall" style={styles.value}>
          {value}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {label}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    flex: 1
  },
  content: {
    gap: spacing.sm
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 18,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  avatar: {
    backgroundColor: "transparent"
  },
  value: {
    fontWeight: "700"
  }
});
