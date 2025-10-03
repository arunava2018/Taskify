interface Todo {
  id: string;
  title: string;
  status: "pending" | "completed";
}

interface PersonalTodosProps {
  tasks: Todo[];
  onToggleStatus: (id: string) => void;
}

function PersonalTodos({ tasks, onToggleStatus }: PersonalTodosProps) {
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="p-6 text-center border rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            No personal todos yet. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {tasks.map((todo) => (
            <div
              key={todo.id}
              className="p-4 border rounded-lg flex justify-between items-center bg-muted"
            >
              <span>{todo.title}</span>
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

export default PersonalTodos;
