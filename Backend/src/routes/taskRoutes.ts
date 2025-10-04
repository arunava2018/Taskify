import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createTask,
  getTasks,
  getPersonalTasks,
  getSharedTasks,
  getTaskById,
  updateTask,
  deleteTask,
  enableShareTask,   
  disableShareTask,
  acceptTaskInvitation,
} from "../controllers/taskController";

const router = express.Router();

/**
 * POST /api/tasks
 * Create a new task
 * - Only logged-in user (owner) can create
 */
router.post("/", authMiddleware, createTask);

/**
 * GET /api/tasks
 * Get all tasks (owned + collaborated)
 */
router.get("/", authMiddleware, getTasks);

/**
 * GET /api/tasks/personal
 * Get all personal (non-shareable) tasks for the user
 */
router.get("/personal", authMiddleware, getPersonalTasks);

/**
 * GET /api/tasks/shared
 * Get all shared tasks (where user is owner or collaborator)
 */
router.get("/shared", authMiddleware, getSharedTasks);

/**
 * GET /api/tasks/:taskId
 * Get details of a single task
 * - Only accessible if user is owner or collaborator
 */
router.get("/:taskId", authMiddleware, getTaskById);

/**
 * PUT /api/tasks/:taskId
 * Update a task
 * - Allowed for owner and collaborators
 */
router.put("/:taskId", authMiddleware, updateTask);

/**
 * DELETE /api/tasks/:taskId
 * Delete a task
 * - Only the owner can delete
 */
router.delete("/:taskId", authMiddleware, deleteTask);

/**
 * POST /api/tasks/:taskId/share/enable
 * Enable sharing on a task
 * - Only the owner can enable sharing
 */
router.post("/:taskId/share/enable", authMiddleware, enableShareTask);

/**
 * POST /api/tasks/:taskId/share/disable
 * Disable sharing on a task
 * - Only the owner can disable
 * - Removes collaborators and clears unique code
 */
router.post("/:taskId/share/disable", authMiddleware, disableShareTask);

/**
 * POST /api/tasks/:taskId/accept
 * Accept an invitation to a shared task
 * - Requires ?code=UNIQUE_CODE in query params
 * - Adds user as collaborator
 */
router.post("/:taskId/accept", authMiddleware, acceptTaskInvitation);

export default router;
