import { Chip } from "react-native-paper";

import { getPriorityColor, getPriorityLabel } from "@/constants/priorities";
import type { Priority } from "@/types/task";

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => (
  <Chip
    compact
    icon="flag-outline"
    textStyle={{ color: getPriorityColor(priority) }}
    style={{ backgroundColor: `${getPriorityColor(priority)}18` }}
  >
    {getPriorityLabel(priority)}
  </Chip>
);
