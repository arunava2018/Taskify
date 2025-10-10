import { useEffect, useState, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Loader2, ClipboardList, Menu, ListTodo, X, Copy } from 'lucide-react'; // 👈 added Copy
import { Toaster, toast } from 'sonner';
import TaskDetails from './TaskDetails';
import type { Task } from './PersonalTasks';
import {
  PRIORITY_COLORS,
  STATUS_COLORS,
  formatDate,
  getProgressColor,
} from '../../constants';

export interface SharedTask extends Task {
  collaborators: string[];
  ownerName?: string;
  shareableLink?: string; // 👈 added
}

const BASEURL = import.meta.env.VITE_BACKEND_URL;

function SharedTodos() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState<SharedTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<SharedTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Helpers ---
  const getTaskProgress = (task: SharedTask) => {
    if (!task.todos || task.todos.length === 0) return 0;
    const completed = task.todos.filter((t) => t.is_completed).length;
    return Math.round((completed / task.todos.length) * 100);
  };

  // --- Fetch shared tasks ---
  const fetchSharedTasksAndTodos = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken({ template: 'postman-test' });
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
          let ownerName = 'Unknown';
          try {
            if (task.created_by) {
              const userRes = await axios.get(
                `${BASEURL}/api/users/${task.created_by}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              ownerName = userRes.data.user_name?.split(' ')[0] || 'Unknown';
            }
          } catch (err) {
            console.warn('Failed to fetch owner name:', err);
          }

          return {
            ...task,
            todos,
            ownerName,
            priority: task.priority || 'low',
            status: task.status || 'pending',
            updatedAt: task.updatedAt || new Date().toISOString(),
          } as SharedTask;
        })
      );

      setTasks(tasksWithExtras);
      if (tasksWithExtras.length > 0) {
        const stillSelected = tasksWithExtras.find(
          (t) => t._id === selectedTask?._id
        );
        setSelectedTask(stillSelected || tasksWithExtras[0]);
      } else {
        setSelectedTask(null);
      }
    } catch (err) {
      console.error('Failed to fetch shared tasks', err);
    } finally {
      setLoading(false);
    }
  }, [getToken, selectedTask?._id]);

  useEffect(() => {
    fetchSharedTasksAndTodos();
  }, [fetchSharedTasksAndTodos]);

  // --- Copy Invite Link ---
  const handleCopyLink = (link?: string) => {
    if (!link) {
      toast.error('No invite link available');
      return;
    }
    navigator.clipboard.writeText(link);
    toast.success('Invite link copied!');
  };

  const handleToggleTodo = async (taskId: string, todoId: string) => {
    try {
      const token = await getToken({ template: 'postman-test' });
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
  // --- Disable collaboration (owner only) ---
  const handleDisableCollaboration = async (task: SharedTask) => {
    try {
      const token = await getToken({ template: 'postman-test' });
      await axios.post(
        `${BASEURL}/api/tasks/${task._id}/share/disable`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Collaboration disabled!');
      fetchSharedTasksAndTodos();
    } catch (err) {
      console.error('Failed to disable collaboration', err);
      toast.error('Failed to disable collaboration');
    }
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 h-auto lg:h-[calc(100vh-100px)]">
          {/* Sidebar */}
          <div
            className={`lg:col-span-4 ${
              sidebarOpen ? 'block' : 'hidden lg:block'
            } bg-card rounded-lg border border-border p-4 lg:p-6 overflow-y-auto`}>
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
                tasks.map((task) => {
                  const progress = getTaskProgress(task);
                  return (
                    <div
                      key={task._id}
                      className={`group p-3 lg:p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        selectedTask?._id === task._id
                          ? 'border-primary bg-primary/5 shadow-sm'
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
                      </div>

                      {/* Progress Bar */}
                      {task.todos && task.todos.length > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{progress}%</span>
                            <span>
                              {task.todos.filter((t) => t.is_completed).length}/
                              {task.todos.length} done
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

                      <p className="text-xs text-muted-foreground mt-2">
                        {task.created_by === user?.id
                          ? 'Created by You'
                          : `Created by ${task.ownerName}`}{' '}
                        <br />
                        Last updated: {formatDate(task.updatedAt)}
                        <br />
                        {task.collaborators.length === 0 ? (
                          <span>Waiting for Collaborators</span>
                        ) : (
                          <span>
                            Collaborators : {task.collaborators.length}
                          </span>
                        )}
                      </p>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-2">
                        {/* Share button for everyone */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLink(task.shareableLink);
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border transition-colors bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20">
                          <Copy className="w-3 h-3" /> Copy Link
                        </button>

                        {/* Disable Collaboration (owner only) */}
                        {task.created_by === user?.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDisableCollaboration(task);
                            }}
                            className="px-2 py-1 text-xs rounded-md border transition-colors bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">
                            Disable
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
              handleUpdateTask={() => {}}
              formatDate={formatDate}
              getPriorityColor={(priority: string) =>
                PRIORITY_COLORS[priority] || 'bg-muted'
              }
              onTodoAdded={(newTodo) =>
                selectedTask &&
                setSelectedTask({
                  ...selectedTask,
                  todos: [...(selectedTask.todos || []), newTodo],
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharedTodos;
