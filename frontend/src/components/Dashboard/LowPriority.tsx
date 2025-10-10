import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Loader2, ClipboardList, Menu, X } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import TaskDetails from './TaskDetails';
import {
  PRIORITY_COLORS,
  STATUS_COLORS,
  getProgressColor,
  formatDate,
} from '../../constants';

interface Todo {
  _id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  task_id: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  due_date?: string;
  todos?: Todo[];
  updatedAt: string;
  created_by?: string;
  is_shareable?: boolean;
  unique_code?: string | null;
  shareableLink?: string;
}

const BASEURL = import.meta.env.VITE_BACKEND_URL;

function LowPriority() {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'in-progress' | 'completed'
  >('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Helper for task progress %
  const getTaskProgress = (task: Task) => {
    if (!task.todos || task.todos.length === 0) return 0;
    const completed = task.todos.filter((t) => t.is_completed).length;
    return Math.round((completed / task.todos.length) * 100);
  };

  // ✅ Fetch both personal + shared LOW priority tasks
  useEffect(() => {
    const fetchLowPriorityTasks = async () => {
      try {
        const token = await getToken({ template: 'postman-test' });

        const personalRes = await axios.get(`${BASEURL}/api/tasks/personal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const personalLow = personalRes.data.filter(
          (t: Task) => t.priority === 'low'
        );

        const sharedRes = await axios.get(`${BASEURL}/api/tasks/shared`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sharedLow = sharedRes.data.filter(
          (t: Task) => t.priority === 'low'
        );

        const combined = [...personalLow, ...sharedLow];

        const tasksWithTodos = await Promise.all(
          combined.map(async (task) => {
            try {
              const todoRes = await axios.get(
                `${BASEURL}/api/todos/${task._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return { ...task, todos: todoRes.data.data || [] };
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
        console.error('Failed to fetch low priority tasks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLowPriorityTasks();
  }, [getToken]);

  // ✅ Toggle todo completion with backend sync
  const handleToggleTodo = async (taskId: string, todoId: string) => {
    try {
      const token = await getToken({ template: 'postman-test' });
      const res = await axios.patch(
        `${BASEURL}/api/todos/${todoId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedTodo = res?.data?.data;
      const taskStatus: Task['status'] = res?.data?.taskStatus || 'pending';

      if (!updatedTodo) return;

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
      console.error('Failed to toggle todo', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = await getToken({ template: 'postman-test' });
      await axios.delete(`${BASEURL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      if (selectedTask?._id === taskId) setSelectedTask(null);
      toast.success('Task deleted!');
    } catch (err) {
      console.error('Failed to delete task', err);
      toast.error('Failed to delete task');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const token = await getToken({ template: 'postman-test' });
      const res = await axios.put(`${BASEURL}/api/tasks/${taskId}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, ...res.data } : t))
      );
      if (selectedTask?._id === taskId) {
        setSelectedTask((prev) => ({ ...prev!, ...res.data }));
      }
      toast.success('Task updated!');
    } catch (err) {
      console.error('Failed to update task', err);
      toast.error('Failed to update task');
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

  const filteredTasks = tasks.filter(
    (task) => filter === 'all' || task.status === filter
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-background via-muted/20 to-primary/5 rounded-lg border border-border">
        <Loader2 className="animate-spin w-10 h-10 text-primary mb-3" />
        <p className="text-muted-foreground font-medium">
          Loading low priority tasks...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-background">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-card rounded-lg border border-border">
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            Low Priority
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-accent rounded-lg transition-colors">
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 h-auto lg:h-[calc(100vh-100px)]">
          {/* Sidebar */}
          <div
            className={`lg:col-span-4 ${
              sidebarOpen ? 'block' : 'hidden lg:block'
            } bg-card rounded-lg border border-border p-4 lg:p-6 overflow-y-auto`}>
            <div className="flex items-center mb-6">
              <h2 className="flex items-center gap-2 font-bold text-base lg:text-md text-card-foreground">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                Low Priority ({filteredTasks.length})
              </h2>
            </div>

            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No low priority tasks
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const progress = getTaskProgress(task);
                  return (
                    <div
                      key={task._id}
                      className={`group p-3 lg:p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        selectedTask?._id === task._id
                          ? 'border-green-500 bg-green-500/5 shadow-sm'
                          : 'border-border bg-background hover:border-border/60'
                      }`}
                      onClick={() => {
                        setSelectedTask(task);
                        setSidebarOpen(false);
                      }}>
                      <div className="cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm lg:text-base font-semibold text-card-foreground truncate flex-1 mr-2">
                            {task.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_COLORS[task.status]}`}>
                            {task.status}
                          </span>
                        </div>

                        {/* ✅ Progress Bar */}
                        {task.todos && task.todos.length > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>{progress}%</span>
                              <span>
                                {
                                  task.todos.filter((t) => t.is_completed)
                                    .length
                                }
                                /{task.todos.length} done
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

                        {/* Personal / Shared marker */}
                        <div className="flex items-center gap-2 mt-2">
                          {!task.is_shareable ? (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              Personal
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              Shared
                            </span>
                          )}
                        </div>
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
                PRIORITY_COLORS[priority] || 'bg-muted'
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

export default LowPriority;
