import {
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_ID
} from "@/constants/categories";
import type {
  Category,
  DashboardStats,
  Priority,
  Task,
  TaskFilters
} from "@/types/task";
import { isTodayIsoDate, parseIsoDate } from "@/utils/date";

export const getTasksForUser = (tasks: readonly Task[], userId: string): Task[] =>
  tasks.filter((task) => task.userId === userId);

const getPriorityWeight = (priority: Priority): number => {
  switch (priority) {
    case "high":
      return 0;
    case "medium":
      return 1;
    case "low":
      return 2;
  }
};

export const sortTasks = (tasks: readonly Task[]): Task[] =>
  [...tasks].sort((first, second) => {
    if (first.status !== second.status) {
      return first.status === "pending" ? -1 : 1;
    }

    const dueDelta =
      parseIsoDate(first.dueDate).getTime() - parseIsoDate(second.dueDate).getTime();

    if (dueDelta !== 0) {
      return dueDelta;
    }

    return getPriorityWeight(first.priority) - getPriorityWeight(second.priority);
  });

export const filterTasks = (
  tasks: readonly Task[],
  filters: TaskFilters,
  categories: readonly Category[]
): Task[] => {
  const query = filters.search.trim().toLowerCase();

  return sortTasks(
    tasks.filter((task) => {
      const category = getCategoryForTask(task, categories);
      const searchable = `${task.title} ${task.description} ${category.name}`.toLowerCase();

      const matchesSearch = query.length === 0 || searchable.includes(query);
      const matchesCategory =
        filters.categoryId === "all" || task.categoryId === filters.categoryId;
      const matchesPriority =
        filters.priority === "all" || task.priority === filters.priority;
      const matchesStatus =
        filters.status === "all" || task.status === filters.status;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    })
  );
};

export const buildDashboardStats = (tasks: readonly Task[]): DashboardStats => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const pending = total - completed;
  const todayCount = tasks.filter((task) => isTodayIsoDate(task.dueDate)).length;
  const completionPercentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    pending,
    todayCount,
    completionPercentage
  };
};

export const getCategoryForTask = (
  task: Task,
  categories: readonly Category[]
): Category => {
  const category = categories.find((item) => item.id === task.categoryId);

  if (category) {
    return category;
  }

  return (
    DEFAULT_CATEGORIES.find((item) => item.id === DEFAULT_CATEGORY_ID) ?? {
      id: "uncategorized",
      name: "Uncategorized",
      color: "#64748B",
      isDefault: true
    }
  );
};

export const getTasksDueToday = (tasks: readonly Task[]): Task[] =>
  sortTasks(tasks.filter((task) => isTodayIsoDate(task.dueDate)));
