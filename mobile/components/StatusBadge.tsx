import { Chip, useTheme } from "react-native-paper";

import type { TaskStatus } from "@/types/task";

interface StatusBadgeProps {
  status: TaskStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const theme = useTheme();
  const isCompleted = status === "completed";

  return (
    <Chip
      compact
      icon={isCompleted ? "check-circle-outline" : "clock-outline"}
      textStyle={{
        color: isCompleted ? "#16A34A" : theme.colors.onSurfaceVariant
      }}
      style={{
        backgroundColor: isCompleted ? "#16A34A18" : theme.colors.surfaceVariant
      }}
    >
      {isCompleted ? "Completed" : "Pending"}
    </Chip>
  );
};
