interface SharedTodo {
  id: string;
  title: string;
  owner: string;
  status: "pending" | "completed";
}

interface SharedTodosProps {
  tasks: SharedTodo[];
  onToggleStatus: (id: string) => void;
}

function SharedTodos({ tasks, onToggleStatus }: SharedTodosProps) {
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="p-6 text-center border rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            No shared todos yet. Once someone shares a task with you, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {tasks.map((todo) => (
            <div
              key={todo.id}
              className="p-4 border rounded-lg flex justify-between items-center bg-muted"
            >
              <div className="flex flex-col">
                <span className="font-medium">{todo.title}</span>
                <span className="text-xs text-muted-foreground">
                  Shared by {todo.owner}
                </span>
              </div>
              <button
                onClick={() => onToggleStatus(todo.id)}
                className={`text-sm px-2 py-1 rounded ${
                  todo.status === "completed"
                    ? "bg-green-200 text-green-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {todo.status}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SharedTodos;
