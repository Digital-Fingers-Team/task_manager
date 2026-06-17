import {
  create,
  isAxiosError,
  type AxiosError,
  type AxiosInstance
} from "axios";

import type {
  AuthSession,
  LoginInput,
  RegisterInput,
  UserProfile
} from "@/types/auth";
import type {
  CreateTaskInput,
  Priority,
  Task,
  TaskStatus,
  UpdateTaskInput
} from "@/types/task";

const DEFAULT_API_URL = "http://localhost:5000/api";
const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL;

interface ApiValidationError {
  field: string;
  message: string;
}

interface ApiErrorBody {
  message?: string;
  errors?: ApiValidationError[];
}

interface ApiUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthResponse {
  token: string;
  user: ApiUser;
}

interface ApiTask {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  completed: boolean;
  dueDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskPayload {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  dueDate: string;
}

let authToken: string | null = null;

export const apiClient: AxiosInstance = create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

export const setApiAuthToken = (token: string | null): void => {
  authToken = token;
};

export const getApiErrorMessage = (error: unknown): string => {
  if (isAxiosError<ApiErrorBody>(error)) {
    const axiosError: AxiosError<ApiErrorBody> = error;
    const validationMessage = axiosError.response?.data?.errors?.[0]?.message;

    return (
      validationMessage ??
      axiosError.response?.data?.message ??
      axiosError.message ??
      "Request failed. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed. Please try again.";
};

const toSession = (response: AuthResponse): AuthSession => ({
  userId: response.user.id,
  name: response.user.name,
  email: response.user.email,
  token: response.token,
  startedAt: new Date().toISOString()
});

const toUserProfile = (user: ApiUser): UserProfile => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt
});

const toMobileTask = (task: ApiTask): Task => ({
  id: task.id,
  userId: task.userId,
  title: task.title,
  description: task.description,
  dueDate: task.dueDate,
  priority: task.priority,
  categoryId: task.category,
  status: task.completed ? "completed" : "pending",
  createdAt: task.createdAt,
  updatedAt: task.updatedAt
});

const toTaskPayload = (input: CreateTaskInput | UpdateTaskInput): TaskPayload => ({
  title: input.title,
  description: input.description,
  priority: input.priority,
  category: input.categoryId,
  dueDate: input.dueDate
});

const toCompleted = (status: TaskStatus): boolean => status === "completed";

export const authService = {
  async register(input: RegisterInput): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", input);
    const session = toSession(data);
    setApiAuthToken(session.token);

    return session;
  },

  async login(input: LoginInput): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", input);
    const session = toSession(data);
    setApiAuthToken(session.token);

    return session;
  },

  async me(): Promise<UserProfile> {
    const { data } = await apiClient.get<{ user: ApiUser }>("/auth/me");

    return toUserProfile(data.user);
  }
};

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const { data } = await apiClient.get<{ tasks: ApiTask[] }>("/tasks");

    return data.tasks.map(toMobileTask);
  },

  async getTask(id: string): Promise<Task> {
    const { data } = await apiClient.get<{ task: ApiTask }>(`/tasks/${id}`);

    return toMobileTask(data.task);
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    const { data } = await apiClient.post<{ task: ApiTask }>(
      "/tasks",
      toTaskPayload(input)
    );

    return toMobileTask(data.task);
  },

  async updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
    const { data } = await apiClient.put<{ task: ApiTask }>(
      `/tasks/${taskId}`,
      toTaskPayload(input)
    );

    return toMobileTask(data.task);
  },

  async setTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const { data } = await apiClient.put<{ task: ApiTask }>(`/tasks/${taskId}`, {
      completed: toCompleted(status)
    });

    return toMobileTask(data.task);
  },

  async deleteTask(taskId: string): Promise<void> {
    await apiClient.delete(`/tasks/${taskId}`);
  }
};
