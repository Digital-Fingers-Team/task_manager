import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from "react-native";
import { useRouter } from "expo-router";
import { FAB, Text, useTheme } from "react-native-paper";

import { EmptyState } from "@/components/EmptyState";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TaskCard } from "@/components/TaskCard";
import { TaskFiltersBar } from "@/components/TaskFiltersBar";
import { useCurrentUserData } from "@/hooks/useCurrentUserData";
import { ROUTES } from "@/navigation/routes";
import { useTaskStore } from "@/store/taskStore";
import { spacing } from "@/theme";
import type { Task, TaskFilters } from "@/types/task";
import { filterTasks, getCategoryForTask } from "@/utils/taskStats";

const INITIAL_FILTERS: TaskFilters = {
  search: "",
  categoryId: "all",
  priority: "all",
  status: "all"
};

export const TasksScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const { session, tasks, categories } = useCurrentUserData();
  const setTaskStatus = useTaskStore((state) => state.setTaskStatus);
  const [filters, setFilters] = useState<TaskFilters>(INITIAL_FILTERS);
  const filteredTasks = useMemo(
    () => filterTasks(tasks, filters, categories),
    [categories, filters, tasks]
  );

  if (!session) {
    return null;
  }

  const renderTask = ({ item }: ListRenderItemInfo<Task>) => (
    <TaskCard
      task={item}
      category={getCategoryForTask(item, categories)}
      onPress={() => {
        router.push(ROUTES.taskDetails(item.id));
      }}
      onToggleStatus={() => {
        void setTaskStatus(
          session.userId,
          item.id,
          item.status === "completed" ? "pending" : "completed"
        );
      }}
      onEdit={() => {
        router.push(ROUTES.editTask(item.id));
      }}
    />
  );

  return (
    <ScreenContainer scroll={false} contentStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Tasks
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {filteredTasks.length} visible
        </Text>
      </View>
      <TaskFiltersBar
        filters={filters}
        categories={categories}
        onChange={setFilters}
      />
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-text-search-outline"
            title={tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
            message={
              tasks.length === 0
                ? "Create a task to start tracking work."
                : "Adjust filters or search terms."
            }
            actionLabel={tasks.length === 0 ? "Create task" : undefined}
            onAction={
              tasks.length === 0
                ? () => {
                    router.push(ROUTES.newTask);
                  }
                : undefined
            }
          />
        }
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => {
          router.push(ROUTES.newTask);
        }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  title: {
    fontWeight: "800"
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 96
  },
  fab: {
    bottom: spacing.xl,
    position: "absolute",
    right: spacing.xl
  }
});
