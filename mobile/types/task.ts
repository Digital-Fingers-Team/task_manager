export type Priority = "low" | "medium" | "high";

export type TaskStatus = "pending" | "completed";

export type FilterStatus = TaskStatus | "all";

export type FilterPriority = Priority | "all";

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  categoryId: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  categoryId: string;
}

export interface UpdateTaskInput {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  categoryId: string;
}

export interface TaskFilters {
  search: string;
  categoryId: string;
  priority: FilterPriority;
  status: FilterStatus;
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  completionPercentage: number;
  todayCount: number;
}
