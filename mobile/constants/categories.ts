import type { Category } from "@/types/task";

export const DEFAULT_CATEGORY_ID = "personal";

export const DEFAULT_CATEGORIES: readonly Category[] = [
  {
    id: "work",
    name: "Work",
    color: "#2563EB",
    isDefault: true
  },
  {
    id: "school",
    name: "School",
    color: "#7C3AED",
    isDefault: true
  },
  {
    id: "personal",
    name: "Personal",
    color: "#14B8A6",
    isDefault: true
  },
  {
    id: "fitness",
    name: "Fitness",
    color: "#F97316",
    isDefault: true
  }
];

export const CATEGORY_COLOR_SWATCHES = [
  "#2563EB",
  "#14B8A6",
  "#F97316",
  "#DC2626",
  "#7C3AED",
  "#0891B2",
  "#16A34A",
  "#DB2777"
] as const;

export const DEFAULT_CUSTOM_CATEGORY_COLOR = "#2563EB";
