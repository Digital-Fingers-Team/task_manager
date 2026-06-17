import type { Priority } from "@/types/task";

export const PRIORITY_VALUES = ["low", "medium", "high"] as const;

export interface PriorityOption {
  label: string;
  value: Priority;
  color: string;
}

export const PRIORITY_OPTIONS: readonly PriorityOption[] = [
  {
    label: "Low",
    value: "low",
    color: "#16A34A"
  },
  {
    label: "Medium",
    value: "medium",
    color: "#D97706"
  },
  {
    label: "High",
    value: "high",
    color: "#DC2626"
  }
];

export const getPriorityLabel = (priority: Priority): string => {
  switch (priority) {
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
  }
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case "low":
      return "#16A34A";
    case "medium":
      return "#D97706";
    case "high":
      return "#DC2626";
  }
};
