import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Divider,
  IconButton,
  Switch,
  Text,
  useTheme
} from "react-native-paper";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { PriorityBadge } from "@/components/PriorityBadge";
import { ScreenContainer } from "@/components/ScreenContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { useCurrentUserData } from "@/hooks/useCurrentUserData";
import { ROUTES } from "@/navigation/routes";
import { useTaskStore } from "@/store/taskStore";
import { radius, spacing } from "@/theme";
import { formatDueDate, formatLongDate } from "@/utils/date";
import { getCategoryForTask } from "@/utils/taskStats";

const getRouteId = (id: string | string[] | undefined): string | undefined =>
  Array.isArray(id) ? id[0] : id;

export const TaskDetailsScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const taskId = getRouteId(id);
  const { session, tasks, categories } = useCurrentUserData();
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const setTaskStatus = useTaskStore((state) => state.setTaskStatus);
  const [isDeleteVisible, setDeleteVisible] = useState(false);
  const task = useMemo(
    () => tasks.find((item) => item.id === taskId),
    [taskId, tasks]
  );

  if (!session) {
    return null;
  }

  if (!task) {
    return (
      <ScreenContainer>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            onPress={() => {
              router.replace(ROUTES.tasks);
            }}
          />
          <Text variant="headlineSmall" style={styles.title}>
            Task details
          </Text>
        </View>
        <EmptyState
          icon="clipboard-alert-outline"
          title="Task not found"
          message="This task may have been deleted."
          actionLabel="Back to tasks"
          onAction={() => {
            router.replace(ROUTES.tasks);
          }}
        />
      </ScreenContainer>
    );
  }

  const category = getCategoryForTask(task, categories);
  const isCompleted = task.status === "completed";

  const toggleStatus = () => {
    void setTaskStatus(
      session.userId,
      task.id,
      isCompleted ? "pending" : "completed"
    );
  };

  const confirmDelete = async () => {
    const result = await deleteTask(session.userId, task.id);
    setDeleteVisible(false);

    if (result.success) {
      router.replace(ROUTES.tasks);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          onPress={() => {
            router.back();
          }}
        />
        <Text variant="headlineSmall" style={styles.title}>
          Task details
        </Text>
      </View>

      <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.content}>
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <Text variant="headlineSmall" style={styles.taskTitle}>
                {task.title}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Due {formatDueDate(task.dueDate)}
              </Text>
            </View>
            <Switch value={isCompleted} onValueChange={toggleStatus} />
          </View>

          <View style={styles.badgeRow}>
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <View
              style={[
                styles.categoryPill,
                { backgroundColor: `${category.color}18` }
              ]}
            >
              <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
              <Text variant="labelMedium">{category.name}</Text>
            </View>
          </View>

          <Divider />

          <View style={styles.infoBlock}>
            <Text variant="labelLarge">Description</Text>
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {task.description.length > 0 ? task.description : "No description"}
            </Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoBlock}>
              <Text variant="labelLarge">Due date</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {formatLongDate(task.dueDate)}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text variant="labelLarge">Updated</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {formatDueDate(task.updatedAt)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actionRow}>
        <Button
          mode="contained"
          icon="pencil-outline"
          onPress={() => {
            router.push(ROUTES.editTask(task.id));
          }}
          style={styles.actionButton}
        >
          Edit
        </Button>
        <Button
          mode="outlined"
          icon="delete-outline"
          textColor={theme.colors.error}
          onPress={() => {
            setDeleteVisible(true);
          }}
          style={styles.actionButton}
        >
          Delete
        </Button>
      </View>

      <ConfirmDialog
        visible={isDeleteVisible}
        title="Delete task"
        message="This task will be permanently removed from this device."
        confirmLabel="Delete"
        isDestructive
        onDismiss={() => {
          setDeleteVisible(false);
        }}
        onConfirm={() => {
          void confirmDelete();
        }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  title: {
    fontWeight: "800"
  },
  card: {
    borderRadius: radius.lg
  },
  content: {
    gap: spacing.lg
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xs
  },
  taskTitle: {
    fontWeight: "800"
  },
  badgeRow: {
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
  },
  infoBlock: {
    gap: spacing.xs
  },
  infoGrid: {
    gap: spacing.md
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg
  },
  actionButton: {
    flex: 1
  }
});
