import type { Types } from "mongoose";

interface SerializableUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  createdAt: Date;
}

interface SerializableTask {
  _id: Types.ObjectId;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  completed: boolean;
  dueDate: Date;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const serializeUser = (user: SerializableUser) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt.toISOString()
});

export const serializeTask = (task: SerializableTask) => ({
  id: task._id.toString(),
  title: task.title,
  description: task.description,
  priority: task.priority,
  category: task.category,
  completed: task.completed,
  dueDate: task.dueDate.toISOString(),
  userId: task.userId.toString(),
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString()
});
