import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    is_shareable: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    due_date: { type: Date },
    created_by: { type: String, ref: "User", required: true },  // Clerk ID
    updated_by: { type: String, ref: "User" },
    unique_code: { type: String, unique: true, sparse: true },
    collaborators: [{ type: String, ref: "User" }],             // Clerk IDs
  },
  { timestamps: true }
);

export default model("Task", TaskSchema);
