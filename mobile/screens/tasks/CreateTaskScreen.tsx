import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

import { EmptyState } from "@/components/EmptyState";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TaskForm } from "@/components/TaskForm";
import { useCurrentUserData } from "@/hooks/useCurrentUserData";
import { ROUTES } from "@/navigation/routes";
import { useTaskStore } from "@/store/taskStore";
import { spacing } from "@/theme";
import type { CreateTaskInput } from "@/types/task";
import type { TaskFormValues } from "@/utils/validation";

export const CreateTaskScreen = () => {
  const router = useRouter();
  const { session, categories } = useCurrentUserData();
  const createTask = useTaskStore((state) => state.createTask);

  if (!session) {
    return null;
  }

  const handleSubmit = async (values: TaskFormValues) => {
    const input: CreateTaskInput = {
      userId: session.userId,
      title: values.title,
      description: values.description,
      dueDate: values.dueDate,
      priority: values.priority,
      categoryId: values.categoryId
    };
    const task = await createTask(input);

    if (task) {
      router.replace(ROUTES.taskDetails(task.id));
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
          New task
        </Text>
      </View>
      {categories.length > 0 ? (
        <TaskForm
          userId={session.userId}
          categories={categories}
          submitLabel="Create task"
          onSubmitTask={handleSubmit}
        />
      ) : (
        <EmptyState
          icon="shape-outline"
          title="Categories are loading"
          message="This will only take a moment."
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
