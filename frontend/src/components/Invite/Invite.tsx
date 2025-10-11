import {
  useAuth,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from '@clerk/clerk-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  User,
  Hash,
  Key,
} from 'lucide-react';
import TaskDetails from './TaskDetails';
import TodoDetails from './TodoDetails';

// Task interface
export interface Task {
  _id: string;
  title: string;
  description: string;
  is_shareable: boolean;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  created_by: string;
  collaborators?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Todo interface
export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
}

const BASEURL = import.meta.env.VITE_BACKEND_URL;

const Invite: React.FC = () => {
  const { getToken } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const [taskId, setTaskId] = useState<string | undefined>();
  const [code, setCode] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState<string>('Owner');
  const [task, setTask] = useState<Task | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isJoining, setIsJoining] = useState<boolean>(false);

  // Fetch task and related todos
  useEffect(() => {
    if (!id) return;

    setTaskId(id);
    const inviteCode = searchParams.get('code');
    setCode(inviteCode);

    const getTaskAndTodos = async () => {
      try {
        const token = await getToken();

        // Fetch task details
        const response = await axios.get(`${BASEURL}/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const taskData: Task = response.data;
        setTask(taskData);

        // Fetch owner details
        const ownerResponse = await axios.get(
          `${BASEURL}/api/users/${taskData.created_by}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOwnerName(ownerResponse.data.user_name);

        // Fetch todos for this task
        const todosResponse = await axios.get(`${BASEURL}/api/todos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Extract and normalize todo data
        const todosData = Array.isArray(todosResponse.data.data)
          ? todosResponse.data.data.map((todo: any) => ({
              _id: todo._id,
              title: todo.title,
              description: todo.description,
              completed: todo.is_completed,
              createdAt: todo.createdAt,
            }))
          : [];

        setTodos(todosData);
      } catch (error) {
        console.error('Error fetching task or todos:', error);
      } finally {
        setLoading(false);
      }
    };

    getTaskAndTodos();
  }, [id, searchParams, getToken]);

  // Handle project join
  const handleJoin = async () => {
    setIsJoining(true);
    try {
      const token = await getToken();

      if (!taskId || !code) {
        toast.error('Invalid invitation link or missing parameters.');
        return;
      }

      // Send POST request to /api/tasks/:taskId/accept?code=...
      const response = await axios.post(
        `${BASEURL}/api/tasks/${taskId}/accept?code=${code}`,
        {}, // no body required
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success toast
      toast.success(
        response.data?.message || 'You successfully joined the project!'
      );
    } catch (err: any) {
      console.error('Error joining project:', err);
      toast.error(
        err.response?.data?.message ||
          'Failed to join the project. Please try again.'
      );
    } finally {
      setIsJoining(false);
      window.location.href = '/dashboard';
    }
  };

  // Handle decline action
  const handleDecline = () => {
    window.location.href = '/dashboard';
  };
  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-4xl mx-auto">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Project Collaboration Invite
              </h1>
              <p className="text-muted-foreground text-lg">
                <span className="font-medium text-foreground">
                  {ownerName.split(' ')[0]}
                </span>{' '}
                has invited you to collaborate
              </p>
            </motion.div>

            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}>
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-xl rounded-2xl overflow-hidden">
                {/* Invite Details Header */}
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          Invitation from {ownerName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Join this collaborative project
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"></motion.div>
                  ) : task ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-8">
                      {/* Task Overview Card */}
                      <TaskDetails task={task} />
                      {/* Todo Items */}
                      {todos.length > 0 && (
                        <div className="bg-gradient-to-br from-card to-muted/20 rounded-xl p-6 border border-border/30">
                          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                            Todo Items ({todos.length})
                          </h3>
                          <TodoDetails todos={todos} />
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                      <p className="text-destructive font-medium text-lg">
                        Failed to load task details
                      </p>
                      <p className="text-muted-foreground mt-2">
                        Please check your connection and try again
                      </p>
                    </motion.div>
                  )}
                </CardContent>

                {/* Action Footer */}
                <CardFooter className="bg-gradient-to-r from-muted/20 to-accent/5 border-t border-border/50 p-6">
                  <div className="w-full space-y-4">
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={handleDecline}
                        className="w-full sm:w-auto px-8 py-2.5 rounded-xl border-2 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all duration-200">
                        Decline Invitation
                      </Button>

                      <Button
                        onClick={handleJoin}
                        disabled={isJoining || !task}
                        className="w-full sm:w-auto px-8 py-2.5  text-white rounded-xl bg-primary hover:bg-primary/90 font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50">
                        {isJoining ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                            className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                          />
                        ) : (
                          <Users className="h-4 w-4 mr-2" />
                        )}
                        {isJoining ? 'Joining...' : 'Accept & Join Project'}
                      </Button>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-xs text-muted-foreground pt-4 border-t border-border/30">
                      <div className="flex items-center space-x-1">
                        <Hash className="h-3 w-3" />
                        <span>Task ID: {taskId ?? 'N/A'}</span>
                      </div>
                      <div className="hidden sm:block w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
                      <div className="flex items-center space-x-1">
                        <Key className="h-3 w-3" />
                        <span>Invite Code: {code ?? 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </SignedIn>

      {/* Redirect to sign-in if unauthenticated */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Invite;
