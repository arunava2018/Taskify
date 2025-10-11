import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import type { Todo } from './Invite';

interface TodoDetailsProps {
  todos: Todo[];
}

const TodoDetails: React.FC<TodoDetailsProps> = ({ todos }) => {
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <h3 className="text-lg font-semibold text-card-foreground">
          To-Do Details
        </h3>
        <p className="text-sm text-muted-foreground">
          {totalCount > 0
            ? `${completedCount} of ${totalCount} completed`
            : 'No todos'}
        </p>
      </div>

      {/* Todo List */}
      <div className="divide-y divide-border/40">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              key={todo._id}
              className={`px-5 py-3 ${
                todo.completed
                  ? 'bg-muted/40 text-muted-foreground line-through'
                  : 'bg-card'
              }`}>
              {/* Title Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {todo.completed ? (
                    <CheckCircle className="w-5 h-5 text-chart-2" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {todo.title}
                  </span>
                </div>

                <span className="text-xs text-muted-foreground">
                  {todo.createdAt
                    ? new Date(todo.createdAt).toLocaleDateString()
                    : ''}
                </span>
              </div>

              {/* Description (only if present) */}
              {todo.description && (
                <p className="text-sm text-muted-foreground mt-1 ml-8">
                  {todo.description}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No todos available for this task.
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoDetails;
