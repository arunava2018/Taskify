import { useState } from "react";
import {
  ListTodo,
  Users,
  Calendar,
  BarChart3,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/clerk-react";

interface AppSidebarProps {
  onNavigate: (view: "personal" | "shared" | "calendar" | "analytics") => void;
  onCreateTodo: () => void;
  todoStats?: {
    personal: number;
    shared: number;
    overdue: number;
    completed: number;
  };
  activeView?: "personal" | "shared" | "calendar" | "analytics";
}

function AppSidebar({
  onNavigate,
  onCreateTodo,
  todoStats = { personal: 0, shared: 0, overdue: 0, completed: 0 },
  activeView = "personal",
}: AppSidebarProps) {
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  
  const navigationItems = [
    {
      key: "personal" as const,
      label: "Personal Tasks",
      icon: ListTodo,
      count: todoStats.personal,
      description: "Your personal tasks",
    },
    {
      key: "shared" as const,
      label: "Shared Tasks",
      icon: Users,
      count: todoStats.shared,
      description: "Collaborative tasks",
    },
    {
      key: "calendar" as const,
      label: "Calendar",
      icon: Calendar,
      count: todoStats.overdue,
      description: "View by due date",
    },
    {
      key: "analytics" as const,
      label: "Analytics",
      icon: BarChart3,
      count: todoStats.completed,
      description: "Track progress",
    },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 h-full md:h-[calc(100vh-64px)] border-r bg-background flex flex-col transition-all duration-300 ${
        collapsed ? "w-20 p-3" : "w-64"
      }`}
    >
      {/* Header: User profile + Collapse toggle */}
      <div className="p-4 border-b flex items-center justify-between shrink-0">
        {!collapsed && user && (
          <div className="flex items-center gap-3 truncate">
            <img
              src={user.imageUrl}
              alt="User avatar"
              className="w-10 h-10 rounded-full border"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-sm truncate">
                {user.fullName || "User"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Scrollable middle section */}
      <div className="flex-1 overflow-y-auto">
        {/* Create Todo Button */}
        <div className="p-4 ">
          <Button onClick={onCreateTodo} className="w-full gap-2  text-white">
            {collapsed ? <Plus className="w-4 h-4" /> : <><Plus className="w-4 h-4" /><span>Create Todo</span></>}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-2 space-y-1">
          {navigationItems.map((item) => {
            const isActive = activeView === item.key;
            const showBadge = item.count > 0;
            const isOverdue = item.key === "calendar" && item.count > 0;

            return (
              <Button
                key={item.key}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 px-3 ${
                  isActive ? "bg-secondary" : "hover:bg-secondary/50"
                }`}
                onClick={() => onNavigate(item.key)}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                )}
                {showBadge && !collapsed && (
                  <Badge
                    variant={isOverdue ? "destructive" : "secondary"}
                    className="ml-auto text-xs"
                  >
                    {item.count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Quick Filters */}
        {!collapsed && (
          <div className="mt-2 px-4">
            <Separator className="mb-4" />
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Quick Filters
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-8 px-3 text-sm"
                onClick={() => onNavigate("personal")}
              >
                <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                High Priority
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-8 px-3 text-sm"
                onClick={() => onNavigate("personal")}
              >
                <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
                Medium Priority
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-8 px-3 text-sm"
                onClick={() => onNavigate("personal")}
              >
                <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                Low Priority
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default AppSidebar;
