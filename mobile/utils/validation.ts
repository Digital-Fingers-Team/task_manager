import { z } from "zod";

import { PRIORITY_VALUES } from "@/constants/priorities";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password")
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be 100 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(600, "Description must be 600 characters or fewer"),
  dueDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Select a valid due date"
  }),
  priority: z.enum(PRIORITY_VALUES),
  categoryId: z.string().min(1, "Choose a category")
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type TaskFormValues = z.infer<typeof taskSchema>;
