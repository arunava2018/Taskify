import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    user_id: { type: String, required: true, unique: true }, // Clerk ID
    user_name: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    shared_tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

export default model("User", UserSchema);
