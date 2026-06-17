import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_ID
} from "@/constants/categories";
import { STORAGE_KEYS } from "@/constants/storage";
import { getApiErrorMessage, taskService } from "@/services/api";
import { zustandStorage } from "@/services/storage";
import type {
  Category,
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput
} from "@/types/task";
import { createId } from "@/utils/id";

interface StoreResult {
  success: boolean;
  message?: string;
}

interface CategoryResult extends StoreResult {
  category?: Category;
}

interface TaskStore {
  tasks: Task[];
  categoriesByUser: Record<string, Category[]>;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  ensureUserCategories: (userId: string) => void;
  loadTasks: (userId: string) => Promise<StoreResult>;
  createTask: (input: CreateTaskInput) => Promise<Task | null>;
  updateTask: (
    userId: string,
    taskId: string,
    input: UpdateTaskInput
  ) => Promise<StoreResult>;
  deleteTask: (userId: string, taskId: string) => Promise<StoreResult>;
  setTaskStatus: (
    userId: string,
    taskId: string,
    status: TaskStatus
  ) => Promise<StoreResult>;
  addCategory: (userId: string, name: string, color: string) => CategoryResult;
  deleteCategory: (
    userId: string,
    categoryId: string,
    fallbackCategoryId?: string
  ) => StoreResult;
  clearUserData: (userId: string) => void;
  clearAllTaskData: () => void;
}

const createDefaultCategories = (): Category[] =>
  DEFAULT_CATEGORIES.map((category) => ({ ...category }));

const getCategoriesForUser = (
  categoriesByUser: Record<string, Category[]>,
  userId: string
): Category[] => categoriesByUser[userId] ?? createDefaultCategories();

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      categoriesByUser: {},
      isLoading: false,
      error: null,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
      ensureUserCategories: (userId) => {
        set((state) => {
          if (state.categoriesByUser[userId]) {
            return {};
          }

          return {
            categoriesByUser: {
              ...state.categoriesByUser,
              [userId]: createDefaultCategories()
            }
          };
        });
      },
      loadTasks: async (userId) => {
        set({ isLoading: true, error: null });

        try {
          const tasks = await taskService.getTasks();

          set((state) => ({
            tasks: [
              ...state.tasks.filter((task) => task.userId !== userId),
              ...tasks
            ],
            isLoading: false,
            error: null
          }));

          return { success: true };
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ isLoading: false, error: message });

          return { success: false, message };
        }
      },
      createTask: async (input) => {
        set({ isLoading: true, error: null });

        try {
          const task = await taskService.createTask(input);

          set((state) => ({
            tasks: [...state.tasks.filter((item) => item.id !== task.id), task],
            isLoading: false,
            error: null
          }));

          return task;
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ isLoading: false, error: message });

          return null;
        }
      },
      updateTask: async (_userId, taskId, input) => {
        set({ isLoading: true, error: null });

        try {
          const updatedTask = await taskService.updateTask(taskId, input);

          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? updatedTask : task
            ),
            isLoading: false,
            error: null
          }));

          return { success: true };
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ isLoading: false, error: message });

          return { success: false, message };
        }
      },
      deleteTask: async (_userId, taskId) => {
        set({ isLoading: true, error: null });

        try {
          await taskService.deleteTask(taskId);

          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
            isLoading: false,
            error: null
          }));

          return { success: true };
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ isLoading: false, error: message });

          return { success: false, message };
        }
      },
      setTaskStatus: async (_userId, taskId, status) => {
        set({ error: null });

        try {
          const updatedTask = await taskService.setTaskStatus(taskId, status);

          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? updatedTask : task
            ),
            error: null
          }));

          return { success: true };
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ error: message });

          return { success: false, message };
        }
      },
      addCategory: (userId, name, color) => {
        let result: CategoryResult = {
          success: false,
          message: "Category could not be created."
        };

        set((state) => {
          const categories = getCategoriesForUser(state.categoriesByUser, userId);
          const trimmedName = name.trim();
          const exists = categories.some(
            (category) =>
              category.name.trim().toLowerCase() === trimmedName.toLowerCase()
          );

          if (trimmedName.length < 2) {
            result = {
              success: false,
              message: "Category name must be at least 2 characters."
            };

            return {
              categoriesByUser: {
                ...state.categoriesByUser,
                [userId]: categories
              }
            };
          }

          if (exists) {
            result = {
              success: false,
              message: "This category already exists."
            };

            return {
              categoriesByUser: {
                ...state.categoriesByUser,
                [userId]: categories
              }
            };
          }

          const category: Category = {
            id: createId("category"),
            name: trimmedName,
            color,
            isDefault: false
          };

          result = {
            success: true,
            category
          };

          return {
            categoriesByUser: {
              ...state.categoriesByUser,
              [userId]: [...categories, category]
            }
          };
        });

        return result;
      },
      deleteCategory: (userId, categoryId, fallbackCategoryId = DEFAULT_CATEGORY_ID) => {
        let result: StoreResult = {
          success: false,
          message: "Category not found."
        };

        set((state) => {
          const categories = getCategoriesForUser(state.categoriesByUser, userId);
          const category = categories.find((item) => item.id === categoryId);

          if (!category) {
            return {
              categoriesByUser: {
                ...state.categoriesByUser,
                [userId]: categories
              }
            };
          }

          if (category.isDefault) {
            result = {
              success: false,
              message: "Default categories cannot be deleted."
            };

            return {
              categoriesByUser: {
                ...state.categoriesByUser,
                [userId]: categories
              }
            };
          }

          const fallbackExists = categories.some(
            (item) => item.id === fallbackCategoryId && item.id !== categoryId
          );
          const fallbackId = fallbackExists ? fallbackCategoryId : DEFAULT_CATEGORY_ID;
          const now = new Date().toISOString();

          result = { success: true };

          return {
            categoriesByUser: {
              ...state.categoriesByUser,
              [userId]: categories.filter((item) => item.id !== categoryId)
            },
            tasks: state.tasks.map((task) => {
              if (task.userId !== userId || task.categoryId !== categoryId) {
                return task;
              }

              return {
                ...task,
                categoryId: fallbackId,
                updatedAt: now
              };
            })
          };
        });

        return result;
      },
      clearUserData: (userId) => {
        set((state) => {
          const nextCategoriesByUser = { ...state.categoriesByUser };
          delete nextCategoriesByUser[userId];

          return {
            tasks: state.tasks.filter((task) => task.userId !== userId),
            categoriesByUser: nextCategoriesByUser
          };
        });
      },
      clearAllTaskData: () => {
        set({
          tasks: [],
          categoriesByUser: {},
          isLoading: false,
          error: null,
          hasHydrated: true
        });
      }
    }),
    {
      name: STORAGE_KEYS.tasks,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        categoriesByUser: state.categoriesByUser
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
