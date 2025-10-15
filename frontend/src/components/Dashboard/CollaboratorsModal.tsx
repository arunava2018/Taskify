import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";

interface CollaboratorsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  collaboratorList: { task_id: string; user_id: string; role?: "owner" | "admin" | "member" }[];
  baseUrl: string;
  currentUserId?: string;
  onInviteCollaborator?: () => void;
  canManageCollaborators?: boolean;
}

interface User {
  id: string;
  name: string;
  role?: "owner" | "admin" | "member";
}

export default function CollaboratorsModal({
  open,
  onOpenChange,
  taskId,
  collaboratorList,
  baseUrl,
  currentUserId,
  onInviteCollaborator,
  canManageCollaborators = false,
}: CollaboratorsModalProps) {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [ownerName, setOwnerName] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollaborators = async () => {
      if (!taskId || !open) return;
      setLoading(true);
      try {
        const token = await getToken();

        // Fetch collaborators
        const filtered = collaboratorList.filter((c) => c.task_id === taskId);
        const userPromises = filtered.map(async (collab) => {
          const res = await axios.get(`${baseUrl}/api/users/${collab.user_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return {
            id: res.data.user_id,
            name: res.data.user_name || "Unknown User",
            role: collab.role || "member",
          };
        });
        const usersData = await Promise.all(userPromises);
        setUsers(usersData);

        // Fetch task owner details
        const taskRes = await axios.get(`${baseUrl}/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ownerId = taskRes.data.created_by;

        const ownerRes = await axios.get(`${baseUrl}/api/users/${ownerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOwnerName(ownerRes.data.user_name);
      } catch (err) {
        console.error("Error fetching collaborators:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollaborators();
  }, [taskId, open, collaboratorList, baseUrl, getToken]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] sm:max-w-md max-h-[85vh] p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 shrink-0" />
              <DialogTitle>Collaborators</DialogTitle>
              <Badge variant="secondary" className="text-xs">
                {users.length + (ownerName ? 1 : 0)}
              </Badge>
            </div>
            {onInviteCollaborator && canManageCollaborators && (
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-1" /> Invite
              </Button>
            )}
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            People with access to this task
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-6 text-sm text-muted-foreground">
            Loading collaborators...
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh] mt-3 pr-1 space-y-3 mb-2">
            {/* Owner Section */}
            {ownerName && (
              <div
                className="flex items-center gap-3 p-3 border mb-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500/40"
              >
                <div className="relative">
                  <Avatar className="w-10 h-10 ring-2 ring-yellow-400">
                    <AvatarImage src="" alt={ownerName} />
                    <AvatarFallback className="text-xs font-medium">
                      {ownerName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    {ownerName}
                    <Badge
                      variant="outline"
                      className="text-[10px] flex items-center gap-1 font-medium"
                    >
                      <Crown className="w-3 h-3 text-yellow-500" /> Owner
                    </Badge>
                  </p>
                </div>
                
              </div>
            )}

            {/* Collaborators List */}
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Users className="w-8 h-8 mb-2 opacity-60" />
                <p className="text-sm font-medium">No collaborators yet</p>
              </div>
            ) : (
              users.map((user) => {
                const isCurrentUser = user.id === currentUserId;
                return (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/40 transition-colors",
                      isCurrentUser && "bg-accent/30 border-primary/20"
                    )}
                  >
                    <Avatar className="w-9 h-9">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.name}
                        {isCurrentUser && (
                          <span className="ml-1 text-xs text-muted-foreground">(You)</span>
                        )}
                      </p>
                      <Badge variant="outline" className="text-xs capitalize mt-0.5">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
