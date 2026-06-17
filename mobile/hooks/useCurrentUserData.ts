import { useEffect, useMemo } from "react";

import { DEFAULT_CATEGORIES } from "@/constants/categories";
import { useAuthStore } from "@/store/authStore";
import { useTaskStore } from "@/store/taskStore";
import type { Category, Task } from "@/types/task";
import { getTasksForUser } from "@/utils/taskStats";

const cloneDefaultCategories = (): Category[] =>
  DEFAULT_CATEGORIES.map((category) => ({ ...category }));

export const useCurrentUserData = (): {
  session: ReturnType<typeof useAuthStore.getState>["session"];
  tasks: Task[];
  categories: Category[];
} => {
  const session = useAuthStore((state) => state.session);
  const allTasks = useTaskStore((state) => state.tasks);
  const categoriesByUser = useTaskStore((state) => state.categoriesByUser);
  const ensureUserCategories = useTaskStore((state) => state.ensureUserCategories);
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const userId = session?.userId;

  useEffect(() => {
    if (userId) {
      ensureUserCategories(userId);
      void loadTasks(userId);
    }
  }, [ensureUserCategories, loadTasks, userId]);

  const tasks = useMemo(() => {
    if (!userId) {
      return [];
    }

    return getTasksForUser(allTasks, userId);
  }, [allTasks, userId]);

  const categories = useMemo(() => {
    if (!userId) {
      return [];
    }

    return categoriesByUser[userId] ?? cloneDefaultCategories();
  }, [categoriesByUser, userId]);

  return {
    session,
    tasks,
    categories
  };
};
