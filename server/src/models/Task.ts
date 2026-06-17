import {
  model,
  Schema,
  Types,
  type HydratedDocument,
  type InferSchemaType
} from "mongoose";

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 600
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      required: true,
      default: "medium"
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    completed: {
      type: Boolean,
      required: true,
      default: false
    },
    dueDate: {
      type: Date,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

taskSchema.index({ userId: 1, dueDate: 1, createdAt: -1 });

export type Task = InferSchemaType<typeof taskSchema> & {
  userId: Types.ObjectId;
};
export type TaskDocument = HydratedDocument<Task>;

export const TaskModel = model<Task>("Task", taskSchema);
