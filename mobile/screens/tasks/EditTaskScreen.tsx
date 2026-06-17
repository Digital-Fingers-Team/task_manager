import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

import { EmptyState } from "@/components/EmptyState";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TaskForm } from "@/components/TaskForm";
import { useCurrentUserData } from "@/hooks/useCurrentUserData";
import { ROUTES } from "@/navigation/routes";
import { useTaskStore } from "@/store/taskStore";
import { spacing } from "@/theme";
import type { UpdateTaskInput } from "@/types/task";
import type { TaskFormValues } from "@/utils/validation";

const getRouteId = (id: string | string[] | undefined): string | undefined =>
  Array.isArray(id) ? id[0] : id;

export const EditTaskScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const taskId = getRouteId(id);
  const { session, tasks, categories } = useCurrentUserData();
  const updateTask = useTaskStore((state) => state.updateTask);
  const task = useMemo(
    () => tasks.find((item) => item.id === taskId),
    [taskId, tasks]
  );

  if (!session) {
    return null;
  }

  const handleSubmit = async (values: TaskFormValues) => {
    if (!taskId) {
      return;
    }

    const input: UpdateTaskInput = {
      title: values.title,
      description: values.description,
      dueDate: values.dueDate,
      priority: values.priority,
      categoryId: values.categoryId
    };
    const result = await updateTask(session.userId, taskId, input);

    if (result.success) {
      router.replace(ROUTES.taskDetails(taskId));
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
          Edit task
        </Text>
      </View>
      {task ? (
        <TaskForm
          userId={session.userId}
          categories={categories}
          initialTask={task}
          submitLabel="Save changes"
          onSubmitTask={handleSubmit}
        />
      ) : (
        <EmptyState
          icon="clipboard-alert-outline"
          title="Task not found"
          message="This task may have been deleted."
          actionLabel="Back to tasks"
          onAction={() => {
            router.replace(ROUTES.tasks);
          }}
        />
      )}
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
  }
});
