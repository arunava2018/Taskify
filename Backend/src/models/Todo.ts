import { Schema, model } from "mongoose";

const TodoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    is_completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    due_date: { type: Date },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updated_by: { type: Schema.Types.ObjectId, ref: "User" },
    task_id: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  },
  { timestamps: true }
);

export default model("Todo", TodoSchema);
