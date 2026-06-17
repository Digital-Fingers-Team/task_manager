import { Types } from "mongoose";

import { TaskModel } from "../models/Task";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/errors";
import { serializeTask } from "../utils/serializers";

interface TaskBody {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  dueDate: string;
  completed?: boolean;
}

const getUserObjectId = (userId: string): Types.ObjectId => new Types.ObjectId(userId);

const requireUserId = (reqUser: Express.AuthUser | undefined): string => {
  if (!reqUser) {
    throw new AppError("Authentication is required.", 401);
  }

  return reqUser.id;
};

export const getTasks = asyncHandler(async (req, res) => {
  const userId = requireUserId(req.user);
  const tasks = await TaskModel.find({ userId: getUserObjectId(userId) }).sort({
    dueDate: 1,
    createdAt: -1
  });

  res.status(200).json({
    tasks: tasks.map(serializeTask)
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const userId = requireUserId(req.user);
  const body = req.body as TaskBody;
  const task = await TaskModel.create({
    title: body.title.trim(),
    description: body.description.trim(),
    priority: body.priority,
    category: body.category.trim(),
    completed: false,
    dueDate: new Date(body.dueDate),
    userId: getUserObjectId(userId)
  });

  res.status(201).json({
    task: serializeTask(task)
  });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const userId = requireUserId(req.user);
  const task = await TaskModel.findOne({
    _id: req.params.id,
    userId: getUserObjectId(userId)
  });

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  res.status(200).json({
    task: serializeTask(task)
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const userId = requireUserId(req.user);
  const body = req.body as Partial<TaskBody>;
  const updates: Partial<{
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    category: string;
    completed: boolean;
    dueDate: Date;
  }> = {};

  if (body.title !== undefined) {
    updates.title = body.title.trim();
  }

  if (body.description !== undefined) {
    updates.description = body.description.trim();
  }

  if (body.priority !== undefined) {
    updates.priority = body.priority;
  }

  if (body.category !== undefined) {
    updates.category = body.category.trim();
  }

  if (body.completed !== undefined) {
    updates.completed = body.completed;
  }

  if (body.dueDate !== undefined) {
    updates.dueDate = new Date(body.dueDate);
  }

  const task = await TaskModel.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: getUserObjectId(userId)
    },
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  res.status(200).json({
    task: serializeTask(task)
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const userId = requireUserId(req.user);
  const task = await TaskModel.findOneAndDelete({
    _id: req.params.id,
    userId: getUserObjectId(userId)
  });

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  res.status(204).send();
});
