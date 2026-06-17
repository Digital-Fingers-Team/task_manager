import type { Href } from "expo-router";

export const ROUTES = {
  login: "/login" as Href,
  register: "/register" as Href,
  dashboard: "/dashboard" as Href,
  tasks: "/tasks" as Href,
  settings: "/settings" as Href,
  newTask: "/tasks/new" as Href,
  taskDetails: (id: string): Href => `/tasks/${id}` as Href,
  editTask: (id: string): Href => `/tasks/${id}/edit` as Href
} as const;
