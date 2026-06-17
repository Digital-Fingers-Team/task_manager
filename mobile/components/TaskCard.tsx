import { StyleSheet, View } from "react-native";
import { Button, Card, Checkbox, Text, useTheme } from "react-native-paper";

import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { radius, spacing } from "@/theme";
import type { Category, Task } from "@/types/task";
import { formatDueDate, getDueTone } from "@/utils/date";

interface TaskCardProps {
  task: Task;
  category: Category;
  onPress: () => void;
  onToggleStatus: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TaskCard = ({
  task,
  category,
  onPress,
  onToggleStatus,
  onEdit,
  onDelete
}: TaskCardProps) => {
  const theme = useTheme();
  const isCompleted = task.status === "completed";
  const dueTone = getDueTone(task.dueDate, isCompleted);
  const dueColor =
    dueTone === "overdue"
      ? theme.colors.error
      : dueTone === "today"
        ? theme.colors.tertiary
        : theme.colors.onSurfaceVariant;

  return (
    <Card
      mode="contained"
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Checkbox.Android
            status={isCompleted ? "checked" : "unchecked"}
            onPress={onToggleStatus}
          />
          <View style={styles.titleBlock}>
            <Text
              variant="titleMedium"
              numberOfLines={2}
              style={[styles.title, isCompleted ? styles.completedTitle : null]}
            >
              {task.title}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: dueColor }}
              numberOfLines={1}
            >
              {formatDueDate(task.dueDate)}
            </Text>
          </View>
          <StatusBadge status={task.status} />
        </View>
        {task.description.length > 0 ? (
          <Text
            variant="bodyMedium"
            numberOfLines={2}
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {task.description}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <PriorityBadge priority={task.priority} />
          <View
            style={[
              styles.categoryPill,
              { backgroundColor: `${category.color}18` }
            ]}
          >
            <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
            <Text
              variant="labelMedium"
              style={{ color: theme.colors.onSurface }}
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </View>
        </View>
      </Card.Content>
      {onEdit || onDelete ? (
        <Card.Actions>
          {onEdit ? (
            <Button icon="pencil-outline" onPress={onEdit}>
              Edit
            </Button>
          ) : null}
          {onDelete ? (
            <Button icon="delete-outline" textColor={theme.colors.error} onPress={onDelete}>
              Delete
            </Button>
          ) : null}
        </Card.Actions>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    marginBottom: spacing.md
  },
  content: {
    gap: spacing.md
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  titleBlock: {
    flex: 1,
    gap: 2
  },
  title: {
    fontWeight: "700"
  },
  completedTitle: {
    opacity: 0.58,
    textDecorationLine: "line-through"
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  categoryPill: {
    alignItems: "center",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 32,
    paddingHorizontal: spacing.md
  },
  categoryDot: {
    borderRadius: 5,
    height: 10,
    width: 10
  }
});
