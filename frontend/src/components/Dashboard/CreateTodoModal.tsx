import { useState, useEffect, useCallback } from "react";
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
import { 
  Flag, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubTodo {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  due_date?: string;
}

interface TaskData {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  is_shareable: boolean;
  todos: SubTodo[];
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: TaskData) => void;
}

function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isShareable, setIsShareable] = useState(false);
  const [todos, setTodos] = useState<SubTodo[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldValidation, setFieldValidation] = useState<Record<string, boolean>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setIsShareable(false);
      setTodos([]);
      setErrors({});
      setOpenIndexes([]);
      setIsSubmitting(false);
      setFieldValidation({});
    }
  }, [isOpen]);

  // Inline validation for title
  const validateTitle = useCallback((value: string) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, title: "Task title is required" }));
      setFieldValidation(prev => ({ ...prev, title: false }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, title: "" }));
      setFieldValidation(prev => ({ ...prev, title: true }));
      return true;
    }
  }, []);

  // Validate subtodo
  const validateSubTodo = useCallback((index: number, todo: SubTodo) => {
    const key = `subtodo_${index}`;
    if (!todo.title.trim()) {
      setErrors(prev => ({ ...prev, [key]: "Sub todo title is required" }));
      setFieldValidation(prev => ({ ...prev, [key]: false }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, [key]: "" }));
      setFieldValidation(prev => ({ ...prev, [key]: true }));
      return true;
    }
  }, []);

  const addSubTodo = () => {
    const newTodo = { title: "", description: "", priority: "medium" as const, due_date: "" };
    setTodos([...todos, newTodo]);
    setOpenIndexes([...openIndexes, todos.length]);
  };

  const updateSubTodo = (index: number, field: keyof SubTodo, value: any) => {
    const updated = [...todos];
    updated[index][field] = value;
    setTodos(updated);

    // Validate on blur for title field
    if (field === "title") {
      validateSubTodo(index, updated[index]);
    }
  };

  const removeSubTodo = (index: number) => {
    const updated = [...todos];
    updated.splice(index, 1);
    setTodos(updated);
    
    // Clean up related state
    setOpenIndexes(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`subtodo_${index}`];
      return newErrors;
    });
    setFieldValidation(prev => {
      const newValidation = { ...prev };
      delete newValidation[`subtodo_${index}`];
      return newValidation;
    });
  };

  const toggleCollapse = (index: number) => {
    setOpenIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Validate all fields
    const isTitleValid = validateTitle(title);
    let allSubTodosValid = true;
    
    todos.forEach((todo, index) => {
      if (!validateSubTodo(index, todo)) {
        allSubTodosValid = false;
      }
    });

    if (!isTitleValid || !allSubTodosValid) {
      setIsSubmitting(false);
      return;
    }

    const taskData: TaskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      is_shareable: isShareable,
      todos: todos.map(t => ({
        title: t.title.trim(),
        description: t.description.trim(),
        priority: t.priority,
        due_date: t.due_date ? new Date(t.due_date).toISOString() : undefined,
      })),
    };

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onSubmit) {
        onSubmit(taskData);
      } else {
        console.log("📌 Task form submitted:", taskData);
      }
      
      onClose();
    } catch (error) {
      setErrors({ general: "Failed to create task. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle escape key
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
      low: <Flag className="w-4 h-4 text-green-500" />
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
            Create a task with optional sub-todos to break down your work into manageable pieces.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* General Error Alert */}
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
                className={`pr-10 ${errors.title ? "border-red-500 focus:border-red-500" : 
                  fieldValidation.title ? "border-green-500" : ""}`}
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

          {/* Task Description */}
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

          {/* Task Priority + Shareable */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="taskPriority" className="text-sm font-medium">
                Priority Level
              </Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as "low" | "medium" | "high")}
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

            {/* Shareable Toggle */}
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
                <Label htmlFor="isShareable" className="text-sm cursor-pointer">
                  {isShareable ? "Shared" : "Personal"}
                </Label>
              </div>
            </div>
          </div>

          {/* Sub Todos */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label className="text-sm font-medium">Sub Todos</Label>
                <p className="text-xs text-muted-foreground">
                  Break down your task into smaller, actionable items
                </p>
              </div>
              <Button 
                type="button" 
                size="sm" 
                onClick={addSubTodo}
                disabled={isSubmitting}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Sub Todo
              </Button>
            </div>

            {todos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <p className="text-sm">No sub todos yet</p>
                <p className="text-xs">Click "Add Sub Todo" to get started</p>
              </div>
            )}

            {todos.map((todo, index) => (
              <Collapsible
                key={index}
                open={openIndexes.includes(index)}
                onOpenChange={() => toggleCollapse(index)}
                className="border rounded-lg overflow-hidden"
              >
                <div className="flex justify-between items-center p-4 bg-muted/30">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {todo.title || `Sub Todo ${index + 1}`}
                    </span>
                    {errors[`subtodo_${index}`] && (
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    {fieldValidation[`subtodo_${index}`] && (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeSubTodo(index)}
                      disabled={isSubmitting}
                      className="h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="ghost"
                        className="h-8 w-8"
                      >
                        {openIndexes.includes(index) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>

                <CollapsibleContent className="space-y-3 p-4 border-t bg-background">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter sub todo title"
                        value={todo.title}
                        onChange={(e) => updateSubTodo(index, "title", e.target.value)}
                        onBlur={() => validateSubTodo(index, todo)}
                        className={`pr-10 ${errors[`subtodo_${index}`] ? "border-red-500" : 
                          fieldValidation[`subtodo_${index}`] ? "border-green-500" : ""}`}
                        disabled={isSubmitting}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {getValidationIcon(`subtodo_${index}`)}
                      </div>
                    </div>
                    {errors[`subtodo_${index}`] && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors[`subtodo_${index}`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <Textarea
                      placeholder="Add more details (optional)"
                      value={todo.description}
                      onChange={(e) => updateSubTodo(index, "description", e.target.value)}
                      rows={2}
                      disabled={isSubmitting}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Priority</Label>
                      <Select
                        value={todo.priority}
                        onValueChange={(val) =>
                          updateSubTodo(index, "priority", val as "low" | "medium" | "high")
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              {getPriorityIcon("high")} High
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              {getPriorityIcon("medium")} Medium
                            </div>
                          </SelectItem>
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              {getPriorityIcon("low")} Low
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Due Date</Label>
                      <Input
                        type="date"
                        value={todo.due_date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => updateSubTodo(index, "due_date", e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
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
            disabled={isSubmitting || Object.values(errors).some(error => error)}
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
