import { useState } from 'react';
import {
  ListTodo,
  Users,
  BarChart3,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';

// Tooltip component for collapsed state
const TooltipWrapper = ({
  children,
  content,
  collapsed,
}: {
  children: React.ReactNode;
  content: string;
  collapsed: boolean;
}) => {
  if (!collapsed) return <>{children}</>;

  return (
    <div className="relative group">
      {children}
      <div className="absolute left-full ml-2 px-2 py-1 bg-popover border rounded-md shadow-lg text-sm font-medium text-popover-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
        {content}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-b rotate-45"></div>
      </div>
    </div>
  );
};

// Define shared type so Dashboard & Sidebar agree
export type ViewType =
  | 'personal'
  | 'shared'
  | 'calendar'
  | 'analytics'
  | 'High Priority'
  | 'Medium Priority'
  | 'Low Priority';

interface AppSidebarProps {
  onNavigate: (view: ViewType) => void;
  onCreateTodo: () => void;
  todoStats?: {
    personal: number;
    shared: number;
    overdue: number;
    completed: number;
  };
  activeView?: ViewType;
}

function AppSidebar({
  onNavigate,
  onCreateTodo,
  activeView = 'personal',
}: AppSidebarProps) {
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    {
      key: 'personal' as const,
      label: 'Personal Tasks',
      icon: ListTodo,
      description: 'Your personal tasks',
    },
    {
      key: 'shared' as const,
      label: 'Shared Tasks',
      icon: Users,
      description: 'Collaborative tasks',
    },
    {
      key: 'High Priority' as const,
      label: 'High Priority',
      description: 'High priority tasks',
      icon: AlertTriangle,
      color: 'text-red-500',
    },
    {
      key: 'Medium Priority' as const,
      label: 'Medium Priority',
      description: 'Medium priority tasks',
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      key: 'Low Priority' as const,
      label: 'Low Priority',

      description: 'Low priority tasks',
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      key: 'analytics' as const,
      label: 'Analytics',
      icon: BarChart3,
      description: 'Track progress',
    },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 h-full md:h-[calc(100vh-64px)] border-r bg-background flex flex-col transition-all duration-300 shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      }`}>
      {/* Header: User profile + Collapse toggle */}
      <div
        className={`${collapsed ? 'p-2' : 'p-4'} border-b flex items-center justify-between shrink-0`}>
        {!collapsed && user && (
          <div className="flex items-center gap-3 truncate">
            <img
              src={user.imageUrl}
              alt="User avatar"
              className="w-10 h-10 rounded-full border-2"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-sm truncate">
                {user.fullName || 'User'}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
        )}

        {collapsed && user && (
          <TooltipWrapper
            content={user.fullName || 'User'}
            collapsed={collapsed}>
            <img
              src={user.imageUrl}
              alt="User avatar"
              className="w-10 h-10 rounded-full border-2 mx-auto"
            />
          </TooltipWrapper>
        )}

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className={`${collapsed ? 'w-full justify-center' : 'ml-auto'} hover:bg-secondary/80`}>
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
        <div className={`${collapsed ? 'p-2' : 'p-4'}`}>
          <TooltipWrapper content="Create Tasks" collapsed={collapsed}>
            <Button
              onClick={onCreateTodo}
              className={`w-full gap-2 text-white ${collapsed ? 'px-0 justify-center' : ''}`}>
              <Plus className="w-4 h-4" />
              {!collapsed && <span>Create Tasks</span>}
            </Button>
          </TooltipWrapper>
        </div>

        {/* Navigation */}
        <nav className={`${collapsed ? 'px-1' : 'px-2'} space-y-1`}>
          {navigationItems.map((item) => {
            const isActive = activeView === item.key;
            return (
              <TooltipWrapper
                key={item.key}
                content={item.label}
                collapsed={collapsed}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full ${collapsed ? 'justify-center px-0 h-12' : 'justify-start gap-3 h-12 px-3'} ${
                    isActive
                      ? 'bg-secondary shadow-sm'
                      : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => onNavigate(item.key)}>
                  <div className="flex items-center justify-center">
                    <item.icon
                      className={`w-5 h-5 ${
                        item.color ? item.color : isActive ? 'text-primary' : ''
                      }`}
                    />
                  </div>

                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  )}
                </Button>
              </TooltipWrapper>
            );
          })}
        </nav>

        {/* Footer section for collapsed state */}
        {collapsed && (
          <div className="mt-auto p-2 border-t">
            <TooltipWrapper content="Expand Sidebar" collapsed={collapsed}>
              <div className="text-center text-xs text-muted-foreground py-2">
                <div className="w-8 h-0.5 bg-muted-foreground/30 mx-auto"></div>
              </div>
            </TooltipWrapper>
          </div>
        )}
      </div>
    </aside>
  );
}

export default AppSidebar;
