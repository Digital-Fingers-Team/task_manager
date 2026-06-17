import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Button,
  Card,
  Divider,
  ProgressBar,
  Text,
  useTheme
} from "react-native-paper";

import { EmptyState } from "@/components/EmptyState";
import { ScreenContainer } from "@/components/ScreenContainer";
import { StatCard } from "@/components/StatCard";
import { TaskCard } from "@/components/TaskCard";
import { ROUTES } from "@/navigation/routes";
import { useTaskStore } from "@/store/taskStore";
import { spacing } from "@/theme";
import {
  buildDashboardStats,
  getCategoryForTask,
  getTasksDueToday
} from "@/utils/taskStats";
import { getPriorityLabel, PRIORITY_OPTIONS } from "@/constants/priorities";
import { useCurrentUserData } from "@/hooks/useCurrentUserData";

export const DashboardScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const { session, tasks, categories } = useCurrentUserData();
  const setTaskStatus = useTaskStore((state) => state.setTaskStatus);
  const stats = useMemo(() => buildDashboardStats(tasks), [tasks]);
  const todayTasks = useMemo(() => getTasksDueToday(tasks).slice(0, 5), [tasks]);

  const priorityRows = useMemo(
    () =>
      PRIORITY_OPTIONS.map((priority) => ({
        label: getPriorityLabel(priority.value),
        color: priority.color,
        count: tasks.filter((task) => task.priority === priority.value).length
      })),
    [tasks]
  );

  const categoryRows = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          count: tasks.filter((task) => task.categoryId === category.id).length
        }))
        .filter((row) => row.count > 0),
    [categories, tasks]
  );

  if (!session) {
    return null;
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
            Dashboard
          </Text>
          <Text variant="headlineMedium" style={styles.title}>
            Hi, {session.name}
          </Text>
        </View>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => {
            router.push(ROUTES.newTask);
          }}
        >
          Task
        </Button>
      </View>

      <Card mode="contained" style={[styles.progressCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.progressContent}>
          <View style={styles.progressHeader}>
            <View>
              <Text variant="titleMedium">Completion</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {stats.completed} of {stats.total} tasks done
              </Text>
            </View>
            <Text variant="headlineSmall" style={styles.percentage}>
              {stats.completionPercentage}%
            </Text>
          </View>
          <ProgressBar progress={stats.completionPercentage / 100} />
        </Card.Content>
      </Card>

      <View style={styles.statsGrid}>
        <StatCard label="Total tasks" value={String(stats.total)} icon="format-list-checks" />
        <StatCard
          label="Completed"
          value={String(stats.completed)}
          icon="check-circle-outline"
          accentColor="#16A34A"
        />
      </View>
      <View style={styles.statsGrid}>
        <StatCard
          label="Pending"
          value={String(stats.pending)}
          icon="clock-outline"
          accentColor="#D97706"
        />
        <StatCard
          label="Today"
          value={String(stats.todayCount)}
          icon="calendar-today-outline"
          accentColor={theme.colors.tertiary}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Today tasks
        </Text>
        <Button
          mode="text"
          onPress={() => {
            router.push(ROUTES.tasks);
          }}
        >
          View all
        </Button>
      </View>
      {todayTasks.length > 0 ? (
        todayTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            category={getCategoryForTask(task, categories)}
            onPress={() => {
              router.push(ROUTES.taskDetails(task.id));
            }}
            onToggleStatus={() => {
              void setTaskStatus(
                session.userId,
                task.id,
                task.status === "completed" ? "pending" : "completed"
              );
            }}
          />
        ))
      ) : (
        <EmptyState
          icon="calendar-check-outline"
          title="No tasks due today"
          message="Your daily lane is clear."
          actionLabel="Create task"
          onAction={() => {
            router.push(ROUTES.newTask);
          }}
        />
      )}

      <Card mode="contained" style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title="Breakdown" subtitle="Priority and category mix" />
        <Card.Content style={styles.summaryContent}>
          {priorityRows.map((row) => (
            <View key={row.label} style={styles.summaryRow}>
              <View style={styles.summaryLabel}>
                <View style={[styles.summaryDot, { backgroundColor: row.color }]} />
                <Text variant="bodyMedium">{row.label}</Text>
              </View>
              <Text variant="titleSmall">{row.count}</Text>
            </View>
          ))}
          {categoryRows.length > 0 ? <Divider /> : null}
          {categoryRows.map((row) => (
            <View key={row.category.id} style={styles.summaryRow}>
              <View style={styles.summaryLabel}>
                <View
                  style={[styles.summaryDot, { backgroundColor: row.category.color }]}
                />
                <Text variant="bodyMedium">{row.category.name}</Text>
              </View>
              <Text variant="titleSmall">{row.count}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    marginBottom: spacing.lg
  },
  headerText: {
    flex: 1
  },
  title: {
    fontWeight: "800"
  },
  progressCard: {
    borderRadius: 18,
    marginBottom: spacing.md
  },
  progressContent: {
    gap: spacing.md
  },
  progressHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  percentage: {
    fontWeight: "800"
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm
  },
  sectionTitle: {
    fontWeight: "800"
  },
  summaryCard: {
    borderRadius: 18,
    marginTop: spacing.md
  },
  summaryContent: {
    gap: spacing.md
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  summaryLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  summaryDot: {
    borderRadius: 6,
    height: 12,
    width: 12
  }
});
