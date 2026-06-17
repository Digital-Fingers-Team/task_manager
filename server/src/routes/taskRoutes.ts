import { Router } from "express";
import { body, param } from "express-validator";

import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask
} from "../controllers/taskController";
import { protect } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import { TASK_PRIORITIES } from "../models/Task";

const taskIdValidator = param("id")
  .isMongoId()
  .withMessage("Task id must be a valid MongoDB id.");

const createTaskValidators = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters."),
  body("description")
    .trim()
    .isLength({ max: 600 })
    .withMessage("Description must be 600 characters or fewer."),
  body("priority")
    .isIn(TASK_PRIORITIES)
    .withMessage("Priority must be low, medium, or high."),
  body("category")
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage("Category is required and must be 80 characters or fewer."),
  body("dueDate")
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date.")
];

const updateTaskValidators = [
  body().custom((value) => {
    const bodyValue = value as Record<string, unknown>;
    const allowedFields = [
      "title",
      "description",
      "priority",
      "category",
      "completed",
      "dueDate"
    ];
    const hasAllowedField = allowedFields.some((field) => field in bodyValue);

    if (!hasAllowedField) {
      throw new Error("Provide at least one task field to update.");
    }

    return true;
  }),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters."),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 600 })
    .withMessage("Description must be 600 characters or fewer."),
  body("priority")
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage("Priority must be low, medium, or high."),
  body("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage("Category must be 80 characters or fewer."),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean.")
    .toBoolean(),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date.")
];

export const taskRouter = Router();

taskRouter.use(protect);

taskRouter
  .route("/")
  .get(getTasks)
  .post(createTaskValidators, validateRequest, createTask);

taskRouter
  .route("/:id")
  .get(taskIdValidator, validateRequest, getTaskById)
  .put(taskIdValidator, updateTaskValidators, validateRequest, updateTask)
  .delete(taskIdValidator, validateRequest, deleteTask);
