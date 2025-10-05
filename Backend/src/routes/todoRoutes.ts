import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createTodo,
  getTodosByTask,
  deleteTodo,
  updateTodo,
  toggleTodoCompletion,
} from "../controllers/todoController";

const router = express.Router();

/**
 * POST /api/todo/:taskId/
 * Create a new todo under a specific task
 * - Only logged-in user (owner or collaborator) can create
 */
router.post("/:taskId", authMiddleware, createTodo);

/**
 * GET /api/todo/:taskId
 * Get all todos for a specific task
 * - Only accessible if user is owner or collaborator of the task
 */
router.get("/:taskId", authMiddleware, getTodosByTask);

/**
 * PUT /api/todos/:todoId
 * Update a specific todo
 * - Only the creator or collaborators of the task can update it
 */
router.put("/:todoId", authMiddleware, updateTodo);

/**
 * DELETE /api/todos/:todoId
 * Delete a specific todo
 * - Only the creator or collaborators of the task can delete it
 */
router.delete("/:todoId", authMiddleware, deleteTodo);

/**
 * PATCH /api/todos/:todoId/toggle
 * Mark or unmark a todo as completed
 * - Only the creator or collaborators of the task can toggle completion
 */
router.patch("/:todoId/toggle", authMiddleware, toggleTodoCompletion);

export default router;
