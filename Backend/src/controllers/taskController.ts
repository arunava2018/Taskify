import { Request, Response } from "express";
import Task from "../models/Task";
import User from "../models/User";
import Todo from "../models/Todo";

/**
 * Create a new task
 * - Takes task details from the request body
 * - Associates the task with the logged-in Clerk user (created_by)
 * - Saves the new task in the database
 */
export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Clerk userId from auth middleware
    const { title, description, priority, due_date, is_shareable } = req.body;

    // Always explicitly set unique_code
    const unique_code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const task = new Task({
      title,
      description,
      priority,
      due_date,
      is_shareable,
      unique_code,
      created_by: userId,
      collaborators: [],
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: "Failed to create task" });
  }
};


/**
 * Get all tasks for a user
 * - Finds tasks where the logged-in user is either the owner or a collaborator
 */
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const tasks = await Task.find({
      $or: [{ created_by: userId }, { collaborators: userId }],
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

/**
 * Get personal (non-shareable) tasks
 * - Returns tasks created by the user
 * - Only tasks where "is_shareable" is false
 */
export const getPersonalTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const tasks = await Task.find({
      created_by: userId,
      is_shareable: false,
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching personal tasks:", error);
    res.status(500).json({ error: "Failed to fetch personal tasks" });
  }
};

/**
 * Get shared tasks
 * - Returns tasks where user is owner or collaborator
 * - Only tasks where "is_shareable" is true
 */
export const getSharedTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const tasks = await Task.find({
      $or: [{ created_by: userId }, { collaborators: userId }],
      is_shareable: true,
    });

    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const tasksWithLinks = tasks.map((task) => {
      return {
        ...task.toObject(),
        shareableLink: `${frontendBaseUrl}/invite/${task._id}?code=${task.unique_code}`,
      };
    });

    res.json(tasksWithLinks);
  } catch (error) {
    console.error("Error fetching shared tasks:", error);
    res.status(500).json({ error: "Failed to fetch shared tasks" });
  }
};


/**
 * Get a single task
 */
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
};

/**
 * Update a task
 * - Only allowed if user is owner or collaborator
 * - Merges request body into task and saves it
 */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isOwner = task.created_by === userId;
    const isCollaborator = task.collaborators.includes(userId);

    if (!(isOwner || isCollaborator)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Merge updates from req.body
    Object.assign(task, req.body, { updated_by: userId });
    await task.save();

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

/**
 * Delete a task
 * - Only allowed if the logged-in user is the owner
 * - Delete all the todos associated with the task (cascade delete)
 */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isOwner = task.created_by === userId;
    if (!isOwner) {
      return res.status(403).json({ message: "Only owner can delete task" });
    }
    // Cascade delete: remove task reference from all collaborators' shared_tasks
    const collaborators = await User.find({ user_id: { $in: task.collaborators } });
    for (const collaborator of collaborators) {
      collaborator.shared_tasks = collaborator.shared_tasks.filter(
        tid => tid.toString() !== task._id.toString()
      );
      await collaborator.save();
    }
    // remove todos associated with the task
    await Todo.deleteMany({ task_id: task._id });
    // delete the task itself
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

/**
 * Enable task sharing
 * - Only the owner can enable sharing
 * - Generates a unique code if not already present
 * - Returns the shareable link
 */
export const enableShareTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.created_by !== userId) {
      return res.status(403).json({ message: "Only owner can enable sharing" });
    }

    // Always regenerate unique code when enabling sharing
    task.unique_code = Math.random().toString(36).substring(2, 8).toUpperCase();
    task.is_shareable = true;
    await task.save();
    const frontendBaseUrl = process.env.FRONTEND_URL;
    const shareableLink = `${frontendBaseUrl}/invite/${task._id}?code=${task.unique_code}`;
    res.json({ task, shareableLink });
  } catch (error) {
    console.error("Error enabling share:", error);
    res.status(500).json({ error: "Failed to enable share" });
  }
};


/**
 * Disable task sharing
 * - Only the owner can disable sharing
 * - Clears unique_code and collaborators
 * - Removes task from collaborators' shared_tasks array
 */
export const disableShareTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.created_by !== userId) {
      return res.status(403).json({ message: "Only owner can disable sharing" });
    }

    task.is_shareable = false;
    // Remove task reference from all collaborators' shared_tasks
    const collaborators = await User.find({ user_id: { $in: task.collaborators } });
    for (const collaborator of collaborators) {
      collaborator.shared_tasks = collaborator.shared_tasks.filter(
        tid => tid.toString() !== task._id.toString()
      );
      await collaborator.save();
    }

    task.collaborators = [];
    await task.save();

    res.json(task);
  } catch (error) {
    console.error("Error disabling share:", error);
    res.status(500).json({ error: "Failed to disable share" });
  }
};

/**
 * Accept a task invitation
 * - User provides invitation code in query params
 * - Verifies code matches task.unique_code
 * - Adds user to collaborators
 * - Updates User.shared_tasks
 */
export const acceptTaskInvitation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Clerk userId
    const { taskId } = req.params;
    const { code } = req.query;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if(!task.is_shareable){
      return res.status(404).json({message : "Task is private now"});
    }
    if (task.unique_code !== code) {
      return res.status(400).json({ message: "Invalid invitation code" });
    }
    
    // Prevent duplicate collaborators
    if (task.collaborators.includes(userId)) {
      return res.status(400).json({ message: "Already a collaborator" });
    }

    task.collaborators.push(userId);
    await task.save();

    // Also update the user's shared_tasks array
    const user = await User.findOne({ user_id: userId });
    if (user) {
      if (!user.shared_tasks.includes(task._id)) {
        user.shared_tasks.push(task._id);
        await user.save();
      }
    }

    res.json({ message: "Invitation accepted", task });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ error: "Failed to accept invitation" });
  }
};
/**
 * Mark a task as completed
 * - Only owner or collaborator can mark it completed
 */
export const completeTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isOwner = task.created_by === userId;
    const isCollaborator = task.collaborators.includes(userId);

    if (!(isOwner || isCollaborator)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = "completed";
    await task.save();

    res.json({ message: "Task marked as completed", task });
  } catch (error) {
    console.error("Error marking task completed:", error);
    res.status(500).json({ error: "Failed to mark task as completed" });
  }
}; 