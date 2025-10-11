import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import type { Task } from './Invite';
import {
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  Flag,
  Calendar,
  Layers,
} from 'lucide-react';

interface TaskDetailsProps {
  task: Task;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  // Priority configuration
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          className:
            'bg-destructive/10 text-destructive border border-destructive/20',
          icon: <AlertCircle className="h-3.5 w-3.5" />,
        };
      case 'medium':
        return {
          className: 'bg-chart-1/10 text-chart-1 border border-chart-1/20',
          icon: <Flag className="h-3.5 w-3.5" />,
        };
      default:
        return {
          className: 'bg-chart-2/10 text-chart-2 border border-chart-2/20',
          icon: <Flag className="h-3.5 w-3.5" />,
        };
    }
  };

  // Status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-chart-2" />,
          textColor: 'text-chart-2',
        };
      case 'in-progress':
        return {
          icon: <PlayCircle className="h-4 w-4 text-chart-1" />,
          textColor: 'text-chart-1',
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-muted-foreground" />,
          textColor: 'text-muted-foreground',
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        new Date().getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <Card className="border border-border/50 bg-card rounded-xl shadow-sm">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground leading-tight">
                {task.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {statusConfig.icon}
                <span
                  className={`text-sm capitalize ${statusConfig.textColor}`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
          <Badge
            className={`px-2 py-1 text-sm capitalize font-medium rounded-md ${priorityConfig.className} flex items-center gap-1`}>
            {priorityConfig.icon}
            {task.priority}
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-5">
        {/* Description */}
        {task.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {task.description}
          </p>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Collaborators */}
          <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Collaborators
              </p>
              <p className="text-base font-medium text-foreground">
                {task.collaborators?.length ?? 0}
              </p>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Created
              </p>
              <p className="text-base font-medium text-foreground">
                {formatDate(task.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/30 text-xs text-muted-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-chart-2"></span>
          <span>Active Project</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskDetails;
