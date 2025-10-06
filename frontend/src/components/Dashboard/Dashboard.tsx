import { useState, useCallback } from "react";
import { Menu, Plus } from "lucide-react";
import AppSidebar from "./AppSidebar";
import PersonalTodos from "./PersonalTasks";
import SharedTodos from "./SharedTasks";
import Analytics from "./Analytics";
import CreateTaskModal from "./CreateTaskModal";
import { Button } from "@/components/ui/button";
import HighPriority from "./HighPriority";
import MediumPriority from "./MediumPriority";
import LowPriority from "./LowPriority";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

type ViewType =
  | "personal"
  | "shared"
  | "calendar"
  | "analytics"
  | "High Priority"
  | "Medium Priority"
  | "Low Priority";

// interface TodoStats {
//   personal: number;
//   shared: number;
//   overdue: number;
//   completed: number;
// }

function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>("personal");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  /** -------------------------
   * Handle Create Task Modal
   * ------------------------- */
  const handleCreateTask = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  /** -------------------------
   * Render Content by View
   * ------------------------- */
  const renderMainContent = () => {
    switch (activeView) {
      case "personal":
        return <PersonalTodos />;
      case "shared":
        return <SharedTodos />;
      case "analytics":
        return <Analytics/>;
      case "High Priority":
        return <HighPriority />;
      case "Medium Priority":
        return <MediumPriority />;
      case "Low Priority":
        return <LowPriority />;
      default:
        return <PersonalTodos />;
    }
  };

  /** -------------------------
   * Page Metadata
   * ------------------------- */
  const getPageMeta = () => {
    switch (activeView) {
      case "personal":
        return {
          title: "Personal Tasks",
          description: "Manage your personal tasks and goals",
        };
      case "shared":
        return {
          title: "Shared Tasks",
          description: "Collaborate on shared projects",
        };
      case "calendar":
        return {
          title: "Calendar View",
          description: "View tasks organized by due date",
        };
      case "analytics":
        return {
          title: "Analytics Dashboard",
          description: "Track your productivity metrics",
        };
      case "High Priority":
        return {
          title: "High Priority Tasks",
          description: "View and manage your high priority tasks",
        };
      case "Medium Priority":
        return {
          title: "Medium Priority Tasks",
          description: "View and manage your medium priority tasks",
        };
      case "Low Priority":
        return {
          title: "Low Priority Tasks",
          description: "View and manage your low priority tasks",
        };
      default:
        return {
          title: "Dashboard",
          description: "Welcome to your dashboard",
        };
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
          onCreateTodo={handleCreateTask}
          // todoStats={todoStats}
        />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 w-64">
            <AppSidebar
              activeView={activeView}
              onNavigate={(view) => {
                setActiveView(view);
                setSidebarOpen(false);
              }}
              onCreateTodo={() => {
                handleCreateTask();
                setSidebarOpen(false);
              }}
              // todoStats={todoStats}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col mt-5 md:ml-64">
        {/* Header */}
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
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                  {title}
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            {(activeView === "personal" || activeView === "shared") && (
              <Button
                onClick={handleCreateTask}
                className="gap-2 text-sm md:text-base text-white"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Task</span>
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{renderMainContent()}</div>
        </main>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default Dashboard;
