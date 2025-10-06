import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  Loader2,
  ClipboardList,
  Menu,
  ListTodo,
  X,
  Copy,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import TaskDetails from "./TaskDetails";
import {
  PRIORITY_COLORS,
  STATUS_COLORS,
  getProgressColor,
  formatDate,
} from "../../constants";

interface Todo {
  _id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  priority: "low" | "medium" | "high";
  due_date?: string;
  task_id: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  due_date?: string;
  todos?: Todo[];
  createdAt:string,
  updatedAt: string;
  created_by?: string;
  is_shareable?: boolean;
  unique_code?: string | null;
  shareableLink?: string;
}

const BASEURL = import.meta.env.VITE_BACKEND_URL;

function PersonalTodos() {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "in-progress" | "completed"
  >("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Helpers ---
  const getTaskProgress = (task: Task) => {
    if (!task.todos || task.todos.length === 0) return 0;
    const completed = task.todos.filter((t) => t.is_completed).length;
    return Math.round((completed / task.todos.length) * 100);
  };

  // --- Fetch tasks + todos ---
  useEffect(() => {
    const fetchTasksAndTodos = async () => {
      try {
        const token = await getToken({ template: "postman-test" });
        const taskRes = await axios.get(`${BASEURL}/api/tasks/personal`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const taskList: Task[] = taskRes.data || [];

        const tasksWithTodos = await Promise.all(
          taskList.map(async (task) => {
            try {
              const todoRes = await axios.get(
                `${BASEURL}/api/todos/${task._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const todos = todoRes.data.data || [];
              return { ...task, todos };
            } catch {
              return { ...task, todos: [] };
            }
          })
        );

        setTasks(tasksWithTodos);
        if (tasksWithTodos.length > 0 && !selectedTask) {
          setSelectedTask(tasksWithTodos[0]);
        }
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasksAndTodos();
  }, [getToken]);

  // --- API actions ---
  const handleToggleTodo = async (taskId: string, todoId: string) => {
    try {
      const token = await getToken({ template: "postman-test" });
      const res = await axios.patch(
        `${BASEURL}/api/todos/${todoId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { data: updatedTodo, taskStatus } = res.data;

      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId
            ? {
                ...t,
                status: taskStatus,
                todos: t.todos?.map((todo) =>
                  todo._id === updatedTodo._id ? updatedTodo : todo
                ),
              }
            : t
        )
      );

      if (selectedTask?._id === taskId) {
        setSelectedTask((prev) =>
          prev
            ? {
                ...prev,
                status: taskStatus,
                todos: prev.todos?.map((todo) =>
                  todo._id === updatedTodo._id ? updatedTodo : todo
                ),
              }
            : prev
        );
      }
    } catch (err) {
      console.error("Failed to toggle todo", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = await getToken({ template: "postman-test" });
      await axios.delete(`${BASEURL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      if (selectedTask?._id === taskId) setSelectedTask(null);
      toast.success("Task deleted!");
    } catch (err) {
      console.error("Failed to delete task", err);
      toast.error("Failed to delete task");
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const token = await getToken({ template: "postman-test" });
      const res = await axios.put(`${BASEURL}/api/tasks/${taskId}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, ...res.data } : t))
      );
      if (selectedTask?._id === taskId) {
        setSelectedTask((prev) => ({ ...prev!, ...res.data }));
      }
      toast.success("Task updated!");
    } catch (err) {
      console.error("Failed to update task", err);
      toast.error("Failed to update task");
    }
  };

  const handleTodoAdded = (taskId: string, newTodo: Todo) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId
          ? { ...task, todos: [...(task.todos || []), newTodo] }
          : task
      )
    );
    if (selectedTask?._id === taskId) {
      setSelectedTask((prev) =>
        prev ? { ...prev, todos: [...(prev.todos || []), newTodo] } : prev
      );
    }
  };

  const handleToggleShare = async (task: Task) => {
    try {
      const token = await getToken({ template: "postman-test" });
      if (!task.is_shareable) {
        const res = await axios.post(
          `${BASEURL}/api/tasks/${task._id}/share/enable`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedTask = {
          ...task,
          ...res.data.task,
          shareableLink: res.data.shareableLink,
        };
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? updatedTask : t))
        );
        if (selectedTask?._id === task._id) setSelectedTask(updatedTask);
        toast.success("Collaboration enabled!");
      } else {
        await axios.post(
          `${BASEURL}/api/tasks/${task._id}/share/disable`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedTask = {
          ...task,
          is_shareable: false,
          unique_code: null,
          shareableLink: undefined,
        };
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? updatedTask : t))
        );
        if (selectedTask?._id === task._id) setSelectedTask(updatedTask);
        toast.success("Collaboration disabled!");
      }
    } catch (err) {
      console.error("Failed to toggle share", err);
      toast.error("Failed to toggle share");
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  const filteredTasks = tasks.filter(
    (task) => filter === "all" || task.status === filter
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-background via-muted/20 to-primary/5 rounded-lg border border-border">
        <Loader2 className="animate-spin w-10 h-10 text-primary mb-3" />
        <p className="text-muted-foreground font-medium">
          Loading your workspace...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-background">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-card rounded-lg border border-border">
          <h1 className="text-lg font-bold text-foreground">Personal Tasks</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 h-auto lg:h-[calc(100vh-100px)]">
          {/* Sidebar */}
          <div
            className={`lg:col-span-4 ${
              sidebarOpen ? "block" : "hidden lg:block"
            } bg-card rounded-lg border border-border p-4 lg:p-6 overflow-y-auto`}
          >
            <div className="flex items-center mb-6">
              <h2 className="flex items-center gap-2 font-bold text-base lg:text-md text-card-foreground">
                <ListTodo className="w-5 h-5 text-primary" />
                Tasks ({filteredTasks.length})
              </h2>
            </div>

            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No tasks found</p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const progress = getTaskProgress(task);
                  return (
                    <div
                      key={task._id}
                      className={`group p-3 lg:p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        selectedTask?._id === task._id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-background hover:border-border/60"
                      }`}
                      onClick={() => {
                        setSelectedTask(task);
                        setSidebarOpen(false);
                      }}
                    >
                      <div className="cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm lg:text-base font-semibold text-card-foreground truncate flex-1 mr-2">
                            {task.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_COLORS[task.status]}`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {task.todos && task.todos.length > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{progress}%</span>
                            <span>
                              {
                                task.todos.filter((t) => t.is_completed).length
                              }/{task.todos.length} done
                            </span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-2 transition-all duration-300 ${getProgressColor(
                                progress
                              )}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Share Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleToggleShare(task)}
                          className={`px-2 py-1 text-xs rounded-md border transition-colors mt-1 ${
                            task.is_shareable
                              ? "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
                              : "bg-muted text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          {task.is_shareable
                            ? "Disable Collaboration"
                            : "Enable Collaboration"}
                        </button>

                        {task.is_shareable && task.shareableLink && (
                          <button
                            onClick={() => handleCopyLink(task.shareableLink!)}
                            className="p-1.5 border rounded-md hover:bg-accent transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Task Details */}
          <div className="lg:col-span-8 bg-card rounded-lg border border-border p-4 lg:p-6 overflow-y-auto">
            <TaskDetails
              selectedTask={selectedTask}
              handleToggleTodo={handleToggleTodo}
              handleDeleteTask={handleDeleteTask}
              handleUpdateTask={handleUpdateTask}
              formatDate={formatDate}
              getPriorityColor={(priority: string) =>
                PRIORITY_COLORS[priority] || "bg-muted"
              }
              onTodoAdded={(newTodo) =>
                selectedTask && handleTodoAdded(selectedTask._id, newTodo)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalTodos;
