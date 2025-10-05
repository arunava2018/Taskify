import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import {
  Loader2,
  ClipboardList,
  Menu,
  ListTodo,
  X,
} from "lucide-react";
import { Toaster } from "sonner";
import TaskDetails from "./TaskDetails";
import type { Task } from "./PersonalTasks";

export interface SharedTask extends Task {
  collaborators: string[];
  ownerName?: string; // store owner's first name here
  createdBy?: string; // make sure your backend sends this
}

const BASEURL = import.meta.env.VITE_BACKEND_URL;

function SharedTodos() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState<SharedTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<SharedTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Fetch shared tasks + todos
  useEffect(() => {
    const fetchSharedTasksAndTodos = async () => {
      try {
        const token = await getToken({ template: "postman-test" });
        const taskRes = await axios.get(`${BASEURL}/api/tasks/shared`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const taskList: SharedTask[] = taskRes.data || [];

        const tasksWithExtras = await Promise.all(
          taskList.map(async (task) => {
            // fetch todos
            let todos: any[] = [];
            try {
              const todoRes = await axios.get(
                `${BASEURL}/api/todos/${task._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              todos = todoRes.data.data || [];
            } catch {
              todos = [];
            }

            // fetch owner name
            let ownerName = "Unknown";
            try {
              if (task.created_by) {
                const userRes = await axios.get(
                  `${BASEURL}/api/users/${task.created_by}`
                );
                ownerName = userRes.data.user_name?.split(" ")[0] || "Unknown";
              }
            } catch (err) {
              console.warn("Failed to fetch owner name:", err);
            }

            return {
              ...task,
              todos,
              ownerName,
              priority: task.priority || "low",
              status: task.status || "pending",
              updatedAt: task.updatedAt || new Date().toISOString(),
            } as SharedTask;
          })
        );

        setTasks(tasksWithExtras);
        if (tasksWithExtras.length > 0 && !selectedTask) {
          setSelectedTask(tasksWithExtras[0]);
        }
      } catch (err) {
        console.error("Failed to fetch shared tasks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedTasksAndTodos();
  }, [getToken]);

  // ✅ Toggle todo completion
  const handleToggleTodo = async (taskId: string, todoId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId
          ? {
              ...task,
              todos: task.todos?.map((t) =>
                t._id === todoId ? { ...t, is_completed: !t.is_completed } : t
              ),
            }
          : task
      )
    );
    if (selectedTask?._id === taskId) {
      setSelectedTask((prev) =>
        prev
          ? {
              ...prev,
              todos: prev.todos?.map((t) =>
                t._id === todoId ? { ...t, is_completed: !t.is_completed } : t
              ),
            }
          : prev
      );
    }

    try {
      const token = await getToken({ template: "postman-test" });
      await axios.patch(
        `${BASEURL}/api/todos/${todoId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to toggle todo", err);
    }
  };

  // Collaborators can add todos
  const handleTodoAdded = (taskId: string, newTodo: any) => {
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

  //  Styling helpers
  const getPriorityColor = (priority: string) =>
    ({
      high: "bg-destructive/10 text-destructive border-destructive/20",
      medium:
        "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
      low: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    }[priority] || "bg-muted text-muted-foreground border-border");

  const getStatusColor = (status: string) =>
    ({
      completed:
        "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      "in-progress": "bg-primary/10 text-primary border-primary/20",
      pending:
        "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    }[status] || "bg-muted text-muted-foreground border-border");

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-background via-muted/20 to-primary/5 rounded-lg border border-border">
        <Loader2 className="animate-spin w-10 h-10 text-primary mb-3" />
        <p className="text-muted-foreground font-medium">
          Loading shared workspace...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-background">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-card rounded-lg border border-border">
          <h1 className="text-lg font-bold text-foreground">Shared Tasks</h1>
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
                Shared Tasks ({tasks.length})
              </h2>
            </div>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No shared tasks available
                  </p>
                </div>
              ) : (
                tasks.map((task) => (
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
                          className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {task.created_by === user?.id
                          ? "Created by You"
                          : `Created by ${task.ownerName}`}{" "}
                        <br />
                        Last updated: {formatDate(task.updatedAt)}
                        <br />
                        {task.collaborators.length > 0 && (
                          <span>
                            Collaborators: {task.collaborators.length}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Task Details */}
          <div className="lg:col-span-8 bg-card rounded-lg border border-border p-4 lg:p-6 overflow-y-auto">
            <TaskDetails
              selectedTask={selectedTask}
              handleToggleTodo={handleToggleTodo}
              handleDeleteTask={() => {}} // shared tasks: no delete
              handleUpdateTask={() => {}} // shared tasks: no update
              formatDate={formatDate}
              getPriorityColor={getPriorityColor}
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

export default SharedTodos;
