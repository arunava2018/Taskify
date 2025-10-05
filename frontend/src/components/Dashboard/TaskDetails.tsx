import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Calendar,
  Edit,
  Trash2,
  Target,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task } from "./PersonalTasks";
import { AddTodoModal } from "./AddTodoModal";

interface TaskDetailsProps {
  selectedTask: Task | null;
  handleToggleTodo: (taskId: string, todoId: string) => void;
  handleDeleteTask: (taskId: string) => void;
  handleUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  formatDate: (dateString: string) => string;
  getPriorityColor: (priority: string) => string;
  onTodoAdded: (newTodo: any) => void; 
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  selectedTask,
  handleToggleTodo,
  handleDeleteTask,
  handleUpdateTask,
  formatDate,
  getPriorityColor,
  onTodoAdded,
}) => {
  const [showAddTodo, setShowAddTodo] = useState(false);

  if (!selectedTask) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <Target className="w-10 h-10 text-muted-foreground mb-3" />
        <h3 className="text-base lg:text-lg font-semibold text-card-foreground mb-1">
          No Task Selected
        </h3>
        <p className="text-xs lg:text-sm text-muted-foreground">
          Choose a task from the sidebar to view details and manage todos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Task Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg lg:text-xl font-bold text-card-foreground mb-1.5 break-words">
            {selectedTask.title}
          </h2>
          <p className="text-xs lg:text-sm text-muted-foreground">
            {selectedTask.description || "No description"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* <button
            onClick={() =>
              handleUpdateTask(selectedTask._id, { title: "Updated title" })
            }
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button> */}
          <button
            onClick={() => handleDeleteTask(selectedTask._id)}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Todos Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-base lg:text-lg font-semibold text-card-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Todo Items ({selectedTask.todos?.length || 0})
          </h4>
          <Button
            className="px-1.5 py-1.5 text-sm text-white h-8 w-auto"
            onClick={() => setShowAddTodo(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Todo
          </Button>
        </div>

        <div className="space-y-2.5">
          {selectedTask.todos?.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <Target className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No todos yet</p>
            </div>
          ) : (
            selectedTask.todos?.map((todo) => (
              <div
                key={todo._id}
                className={`p-3 rounded-lg border flex items-start gap-2.5 transition-all duration-200 ${
                  todo.is_completed
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-background border-border hover:border-border/60"
                }`}
              >
                {/* Toggle Button */}
                <button
                  onClick={() => handleToggleTodo(selectedTask._id, todo._id)}
                  className="flex-shrink-0 mt-0.5"
                >
                  {todo.is_completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>

                {/* Todo Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium break-words text-sm ${
                      todo.is_completed
                        ? "line-through text-muted-foreground"
                        : "text-card-foreground"
                    }`}
                  >
                    {todo.title}
                  </p>
                  {todo.description && (
                    <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 break-words">
                      {todo.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {todo.due_date && (
                      <div className="flex items-center gap-1 text-[11px] lg:text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(todo.due_date)}
                      </div>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] lg:text-xs font-medium border ${getPriorityColor(
                        todo.priority
                      )}`}
                    >
                      {todo.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Todo Modal */}
      <AddTodoModal
        open={showAddTodo}
        onClose={() => setShowAddTodo(false)}
        taskId={selectedTask._id}
        onTodoAdded={(newTodo) => {
          onTodoAdded(newTodo);
        }}
      />
    </div>
  );
};

export default TaskDetails;
