import { Request, Response } from "express";
import Todo from "../models/Todo";
import Task from "../models/Task";
import { io } from "../index";

// helper to emit events to a specific task room
const emitToTaskRoom = (taskId: string, event: string, data: any) => {
  try {
    io.to(taskId).emit(event, data);
  } catch (error) {
    console.error("Socket emit failed:", error);
  }
};

/**
 * Create a new todo
 */
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, due_date } = req.body;
    const { taskId } = req.params;
    const userId = (req as any).userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const newTodo = new Todo({
      title,
      description,
      priority,
      due_date,
      task_id: taskId,
      created_by: userId,
      is_completed: false,
    });

    const savedTodo = await newTodo.save();

    emitToTaskRoom(taskId, "todo_created", { todo: savedTodo });

    return res.status(201).json({ success: true, data: savedTodo });
  } catch (error) {
    console.error("Error creating todo:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/**
 * Get todos for a specific task
 */
export const getTodosByTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const todos = await Todo.find({ task_id: taskId }).sort({ createdAt: -1 });
    return res.json({ success: true, data: todos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/**
 * Update a todo
 */
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;
    const { title, description, is_completed, priority, due_date } = req.body;
    const userId = (req as any).userId;

    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    const task = await Task.findById(todo.task_id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Associated task not found" });
    }

    if (task.created_by !== userId && !task.collaborators.includes(userId)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    todo.title = title ?? todo.title;
    todo.description = description ?? todo.description;
    todo.is_completed = is_completed ?? todo.is_completed;
    todo.priority = priority ?? todo.priority;
    todo.due_date = due_date ?? todo.due_date;
    todo.updated_by = userId;

    const updatedTodo = await todo.save();

    emitToTaskRoom(task._id.toString(), "todo_updated", { todo: updatedTodo });

    return res.json({ success: true, data: updatedTodo });
  } catch (error) {
    console.error("Error updating todo:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/**
 * Delete a todo
 */
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;
    const userId = (req as any).userId;

    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    const task = await Task.findById(todo.task_id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Associated task not found" });
    }

    if (task.created_by !== userId && !task.collaborators.includes(userId)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await Todo.deleteOne({ _id: todoId });

    emitToTaskRoom(task._id.toString(), "todo_deleted", { todoId });

    return res.json({ success: true, message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

/**
 * Toggle todo completion
 */
export const toggleTodoCompletion = async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;
    const userId = (req as any).userId;

    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    const task = await Task.findById(todo.task_id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Associated task not found" });
    }

    if (task.created_by !== userId && !task.collaborators.includes(userId)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    todo.is_completed = !todo.is_completed;
    todo.updated_by = userId;
    const updatedTodo = await todo.save();

    const total = await Todo.countDocuments({ task_id: task._id });
    const done = await Todo.countDocuments({ task_id: task._id, is_completed: true });

    let newStatus: "pending" | "in-progress" | "completed" = "pending";
    if (done === total && total > 0) newStatus = "completed";
    else if (done > 0) newStatus = "in-progress";

    task.status = newStatus;
    await task.save();

    emitToTaskRoom(task._id.toString(), "todo_toggled", {
      todo: updatedTodo,
      taskStatus: task.status,
    });

    return res.json({ success: true, data: updatedTodo, taskStatus: task.status });
  } catch (error) {
    console.error("Error toggling todo:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
