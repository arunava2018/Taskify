import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Flag, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const BASEURL = import.meta.env.VITE_BACKEND_URL;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (task: any) => void; // parent will update task list
}

function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const { getToken } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isShareable, setIsShareable] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldValidation, setFieldValidation] = useState<Record<string, boolean>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setIsShareable(false);
      setErrors({});
      setIsSubmitting(false);
      setFieldValidation({});
    }
  }, [isOpen]);

  // Validate title
  const validateTitle = useCallback((value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, title: "Task title is required" }));
      setFieldValidation((prev) => ({ ...prev, title: false }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, title: "" }));
      setFieldValidation((prev) => ({ ...prev, title: true }));
      return true;
    }
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const isTitleValid = validateTitle(title);
    if (!isTitleValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const token = await getToken();

      // 1️⃣ Create task only
      const taskRes = await axios.post(
        `${BASEURL}/api/tasks`,
        {
          title: title.trim(),
          description: description.trim(),
          priority,
          is_shareable: isShareable,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const createdTask = taskRes.data.task;

      // Show toast
      toast.success("Task created successfully!");

      // Update parent immediately (no reload)
      if (onSubmit) {
        onSubmit(createdTask);
      }

      onClose();
    } catch (error) {
      console.error(error);
      setErrors({ general: "Failed to create task. Please try again." });
      toast.error("Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isSubmitting, onClose]);

  const getPriorityIcon = (priority: "low" | "medium" | "high") => {
    const icons = {
      high: <Flag className="w-4 h-4 text-red-500" />,
      medium: <Flag className="w-4 h-4 text-yellow-500" />,
      low: <Flag className="w-4 h-4 text-green-500" />,
    };
    return icons[priority];
  };

  const getValidationIcon = (fieldKey: string) => {
    if (fieldValidation[fieldKey] === true) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    } else if (fieldValidation[fieldKey] === false || errors[fieldKey]) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task with priority and optional description.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="taskTitle" className="text-sm font-medium">
              Task Title <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="taskTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => validateTitle(title)}
                placeholder="Enter a clear, descriptive task title"
                className={`pr-10 ${
                  errors.title
                    ? "border-red-500"
                    : fieldValidation.title
                    ? "border-green-500"
                    : ""
                }`}
                disabled={isSubmitting}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getValidationIcon("title")}
              </div>
            </div>
            {errors.title && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="taskDescription" className="text-sm font-medium">
              Task Description
            </Label>
            <Textarea
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional context or details (optional)"
              rows={3}
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>

          {/* Priority & Shareable */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taskPriority" className="text-sm font-medium">
                Priority Level
              </Label>
              <Select
                value={priority}
                onValueChange={(val) =>
                  setPriority(val as "low" | "medium" | "high")
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id="taskPriority">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon("high")} High Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon("medium")} Medium Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon("low")} Low Priority
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isShareable" className="text-sm font-medium">
                Task Sharing
              </Label>
              <div className="flex items-center space-x-2 h-10 px-3">
                <Switch
                  id="isShareable"
                  checked={isShareable}
                  onCheckedChange={setIsShareable}
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="isShareable"
                  className="text-sm cursor-pointer"
                >
                  {isShareable ? "Shared" : "Personal"}
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none sm:min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.values(errors).some((e) => e)}
            className="flex-1 sm:flex-none sm:min-w-[120px]"
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTaskModal;
