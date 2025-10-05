import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useState } from "react";

interface AddTodoModalProps {
  open: boolean;
  onClose: () => void;
  taskId: string;
  onTodoAdded: (todo: any) => void; // callback to refresh todos in parent
}

const BASEURL = import.meta.env.VITE_BACKEND_URL;

export function AddTodoModal({ open, onClose, taskId, onTodoAdded }: AddTodoModalProps) {
  const { getToken } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTodo = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    setLoading(true);
    try {
      const token = await getToken({ template: "postman-test" });
      const res = await axios.post(
        `${BASEURL}/api/todos/${taskId}`,
        { title, description, priority, due_date: dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("API response new todo:", res.data);
      onTodoAdded(res.data.data); // push new todo into state in parent
      toast.success("Todo added!");
      setTitle("");
      setDescription("");
      setPriority("low");
      setDueDate("");
      onClose();
    } catch (err) {
      console.error("Failed to add todo", err);
      toast.error("Failed to add todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md space-y-2">
        <DialogHeader>
          <DialogTitle>Add New Todo</DialogTitle>
          <DialogDescription>
            Create a new todo under this task.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Enter todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Enter todo description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(val: "low" | "medium" | "high") => setPriority(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAddTodo} disabled={loading} className="text-white bg-primary hover:bg-primary/90">
            {loading ? "Adding..." : "Add Todo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
