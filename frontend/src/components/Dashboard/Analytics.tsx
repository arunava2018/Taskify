import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ListTodo, Users, CheckCircle2, AlertTriangle } from "lucide-react";

interface AnalyticsProps {
  todoStats: {
    personal: number;
    shared: number;
    overdue: number;
    completed: number;
  };
}

function Analytics({ todoStats }: AnalyticsProps) {
  const stats = [
    {
      label: "Personal Todos",
      value: todoStats.personal,
      icon: ListTodo,
      color: "text-blue-600",
    },
    {
      label: "Shared Todos",
      value: todoStats.shared,
      icon: Users,
      color: "text-purple-600",
    },
    {
      label: "Completed",
      value: todoStats.completed,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      label: "Overdue",
      value: todoStats.overdue,
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  const isEmpty = stats.every((s) => s.value === 0);

  return (
    <div className="space-y-6">
      {isEmpty ? (
        <div className="p-6 text-center border rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            No analytics data available yet. Start adding todos to see insights here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className={`h-5 w-5 ${color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Analytics;
