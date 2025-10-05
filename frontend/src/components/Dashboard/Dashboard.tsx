import { useState, useEffect, useCallback } from "react";
import AppSidebar from "./AppSidebar";
import PersonalTodos from "./PersonalTasks";
import SharedTodos from "./SharedTasks";
import CalendarView from "./CalendarView";
import Analytics from "./Analytics";
import CreateTaskModal from "./CreateTodoModal";
import { Button } from "@/components/ui/button";
import { Plus, Menu } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

type ViewType = "personal" | "shared" | "calendar" | "analytics";

interface TodoStats {
  personal: number;
  shared: number;
  overdue: number;
  completed: number;
}

interface PersonalTask {
  id: string;
  title: string;
  status: "pending" | "completed";
}

interface SharedTask {
  id: string;
  title: string;
  owner: string;
  status: "pending" | "completed";
}

function Dashboard() {
  const { getToken, isSignedIn } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>("personal");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [todoStats, setTodoStats] = useState<TodoStats>({
    personal: 0,
    shared: 0,
    overdue: 0,
    completed: 0,
  });
  
  const [personalTodos, setPersonalTodos] = useState<PersonalTask[]>([]);
  const [sharedTodos, setSharedTodos] = useState<SharedTask[]>([]);
  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        const token = await getToken({ template: "postman-test" });
        console.log("Clerk JWT:", token);
      }
    };
    fetchToken();
  }, [getToken, isSignedIn]);
  /** -------------------------
   * Fetch Data from backend
   * ------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const personalTasks = await fetch("/api/tasks/personal");
        const sharedTasks = await fetch("/api/sharedtasks");
        const stats = await fetch("/api/tasks/stats");
        const data = await stats.json();
        if (personalTasks.ok) {
          const personalData = await personalTasks.json();
          setPersonalTodos(personalData.tasks || []);
        }
        if (sharedTasks.ok) {
          const sharedData = await sharedTasks.json();
          setSharedTodos(sharedData.tasks || []);
        }
        setTodoStats(data.stats || { personal: 0, shared: 0, overdue: 0, completed: 0 });
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };

    fetchData();
  }, []);

  /** -------------------------
   * Handlers
   * ------------------------- */
  const handleCreateTodo = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleTogglePersonal = (id: string) => {
    setPersonalTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t
      )
    );
  };

  const handleToggleShared = (id: string) => {
    setSharedTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t
      )
    );
  };

  /** -------------------------
   * Render Helpers
   * ------------------------- */
  const renderMainContent = () => {
    switch (activeView) {
      case "personal":
        return <PersonalTodos tasks={personalTodos} onToggleStatus={handleTogglePersonal} />;
      case "shared":
        return <SharedTodos tasks={sharedTodos} onToggleStatus={handleToggleShared} />;
      case "calendar":
        return <CalendarView />;
      case "analytics":
        return <Analytics todoStats={todoStats} />;
      default:
        return <PersonalTodos tasks={personalTodos} onToggleStatus={handleTogglePersonal} />;
    }
  };

  const getPageMeta = (): { title: string; description: string } => {
    switch (activeView) {
      case "personal":
        return { title: "Personal Tasks", description: "Manage your personal tasks and goals" };
      case "shared":
        return { title: "Shared Tasks", description: "Collaborate on shared projects" };
      case "calendar":
        return { title: "Calendar View", description: "View tasks organized by due date" };
      case "analytics":
        return { title: "Analytics Dashboard", description: "Track your productivity metrics" };
      default:
        return { title: "Dashboard", description: "Welcome to your dashboard" };
    }
  };

  const { title, description } = getPageMeta();

  return (
    <div className="flex relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebar
          activeView={activeView}
          onNavigate={setActiveView}
          onCreateTodo={handleCreateTodo}
          todoStats={todoStats}
        />
      </div>

      {/* Mobile Sidebar (overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 w-64">
            <AppSidebar
              activeView={activeView}
              onNavigate={(view) => {
                setActiveView(view);
                setSidebarOpen(false);
              }}
              onCreateTodo={() => {
                handleCreateTodo();
                setSidebarOpen(false);
              }}
              todoStats={todoStats}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col mt-16 md:ml-64">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 rounded-md hover:bg-muted"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h1>
                <p className="text-xs md:text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            {(activeView === "personal" || activeView === "shared") && (
              <Button onClick={handleCreateTodo} className="gap-2 text-sm md:text-base text-white">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Todo</span>
              </Button>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{renderMainContent()}</div>
        </main>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}

export default Dashboard;
