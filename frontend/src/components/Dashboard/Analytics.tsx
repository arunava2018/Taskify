import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import type { Task } from "@/components/Dashboard/PersonalTasks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Clock} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import dayjs from "dayjs";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

function Analytics() {
  const { getToken } = useAuth();
  const [personalTasks, setPersonalTasks] = useState<Task[]>([]);
  const [sharedTasks, setSharedTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [trendData, setTrendData] = useState<any[]>([]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const token = await getToken({ template: "postman-test" });

      const [personalRes, sharedRes] = await Promise.all([
        axios.get(`${BASEURL}/api/tasks/personal`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASEURL}/api/tasks/shared`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPersonalTasks(personalRes.data);
      setSharedTasks(sharedRes.data);
    };

    fetchTasks();
  }, []);

  // Recalculate counts + trend
  useEffect(() => {
    let completed = 0;
    let inProgress = 0;
    let pending = 0;

    const allTasks = [...personalTasks, ...sharedTasks];
    for (const task of allTasks) {
      if (task.status === "completed") completed++;
      else if (task.status === "in-progress") inProgress++;
      else if (task.status === "pending") pending++;
    }

    setCompletedTasks(completed);
    setInProgressTasks(inProgress);
    setPendingTasks(pending);

    // --- Build trend data by createdAt ---
    const grouped: Record<
      string,
      { completed: number; inProgress: number; pending: number }
    > = {};

    allTasks.forEach((task) => {
      const day = dayjs(task.createdAt).format("YYYY-MM-DD");
      if (!grouped[day]) {
        grouped[day] = { completed: 0, inProgress: 0, pending: 0 };
      }
      if (task.status === "completed") grouped[day].completed++;
      else if (task.status === "in-progress") grouped[day].inProgress++;
      else if (task.status === "pending") grouped[day].pending++;
    });

    const trendArr = Object.entries(grouped).map(([day, counts]) => ({
      day,
      ...counts,
    }));

    setTrendData(trendArr);
  }, [personalTasks, sharedTasks]);

  // Pie chart for status distribution
  const statusData = [
    { name: "Completed", value: completedTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Pending", value: pendingTasks },
  ];

  // Pie chart for Personal vs Shared distribution
  const sourceData = [
    { name: "Personal Tasks", value: personalTasks.length },
    { name: "Shared Tasks", value: sharedTasks.length },
  ];

  const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-lg rounded-xl border bg-card">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Completed</CardTitle>
            <CheckCircle2 className="text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{completedTasks}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl border bg-card">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">In Progress</CardTitle>
            <Clock className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{inProgressTasks}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl border bg-card">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Pending</CardTitle>
            <AlertTriangle className="text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{pendingTasks}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart: Status Distribution */}
      <Card className="shadow-lg rounded-xl border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart: Daily Trends */}
      <Card className="shadow-lg rounded-xl border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Task Trends by Date</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="var(--chart-1)" strokeWidth={3} />
              <Line type="monotone" dataKey="inProgress" stroke="var(--chart-2)" strokeWidth={3} />
              <Line type="monotone" dataKey="pending" stroke="var(--chart-3)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart: Personal vs Shared */}
      <Card className="shadow-lg rounded-xl border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Personal vs Shared Tasks</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="var(--chart-4)" barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default Analytics;
