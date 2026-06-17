import {
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme
} from "react-native-paper";

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999
} as const;

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#2563EB",
    onPrimary: "#FFFFFF",
    primaryContainer: "#DCE8FF",
    onPrimaryContainer: "#0B2F66",
    secondary: "#14B8A6",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#CCFBF1",
    onSecondaryContainer: "#123F3A",
    tertiary: "#F97316",
    tertiaryContainer: "#FFEDD5",
    background: "#F7F9FC",
    onBackground: "#18202F",
    surface: "#FFFFFF",
    onSurface: "#18202F",
    surfaceVariant: "#E7ECF3",
    onSurfaceVariant: "#526070",
    outline: "#CBD5E1",
    error: "#DC2626",
    errorContainer: "#FEE2E2"
  }
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 3,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#8BB7FF",
    onPrimary: "#081A33",
    primaryContainer: "#17345F",
    onPrimaryContainer: "#D9E8FF",
    secondary: "#4DD7C8",
    onSecondary: "#062E2A",
    secondaryContainer: "#173F3A",
    onSecondaryContainer: "#D2FFF8",
    tertiary: "#FFB36B",
    tertiaryContainer: "#5C3212",
    background: "#101214",
    onBackground: "#E7EAEE",
    surface: "#181B1F",
    onSurface: "#E7EAEE",
    surfaceVariant: "#252A31",
    onSurfaceVariant: "#C7CDD6",
    outline: "#444C56",
    error: "#FFB4AB",
    errorContainer: "#5F1717"
  }
};
