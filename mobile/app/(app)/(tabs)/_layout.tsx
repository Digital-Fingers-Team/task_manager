import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";

type MaterialIconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const getIconName = (routeName: string, focused: boolean): MaterialIconName => {
  switch (routeName) {
    case "dashboard":
      return focused ? "view-dashboard" : "view-dashboard-outline";
    case "tasks":
      return focused ? "format-list-checks" : "format-list-checkbox";
    case "settings":
      return focused ? "cog" : "cog-outline";
    default:
      return "circle-outline";
  }
};

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          minHeight: 64,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarIcon: ({ color, focused, size }) => (
          <MaterialCommunityIcons
            name={getIconName(route.name, focused)}
            color={color}
            size={size}
          />
        )
      })}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
