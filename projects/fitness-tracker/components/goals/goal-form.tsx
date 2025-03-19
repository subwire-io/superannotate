import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { generateId } from "@/lib/utils";
import { Goal } from "@/types";

interface GoalFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  editGoal?: Goal;
}

export function GoalForm({ open, onClose, onSave, editGoal }: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"strength" | "cardio" | "weight" | "custom">("strength");
  const [targetValue, setTargetValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [unit, setUnit] = useState("");
  const [deadline, setDeadline] = useState("");
  
  useEffect(() => {
    if (editGoal) {
      setTitle(editGoal.title);
      setDescription(editGoal.description || "");
      setCategory(editGoal.category);
      setTargetValue(editGoal.targetValue.toString());
      setCurrentValue(editGoal.currentValue.toString());
      setUnit(editGoal.unit);
      setDeadline(editGoal.deadline ? editGoal.deadline.split('T')[0] : "");
    } else {
      resetForm();
    }
  }, [editGoal, open]);
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("strength");
    setTargetValue("");
    setCurrentValue("");
    setUnit("");
    setDeadline("");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goal: Goal = {
      id: editGoal ? editGoal.id : generateId(),
      title,
      description: description || undefined,
      category,
      targetValue: parseFloat(targetValue),
      currentValue: parseFloat(currentValue),
      unit,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      completed: false,
      createdAt: editGoal ? editGoal.createdAt : new Date().toISOString()
    };
    
    onSave(goal);
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editGoal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
          <DialogDescription>
            {editGoal ? "Update your fitness goal" : "Create a new fitness goal to track"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Increase Bench Press, Run 5K, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Provide details about your goal"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category}
                onValueChange={(value: "strength" | "cardio" | "weight" | "custom") => setCategory(value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (optional)</Label>
              <Input 
                id="deadline" 
                type="date" 
                value={deadline} 
                onChange={e => setDeadline(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-value">Current Value</Label>
              <Input 
                id="current-value" 
                type="number" 
                value={currentValue} 
                onChange={e => setCurrentValue(e.target.value)} 
                required
                step="any"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-value">Target Value</Label>
              <Input 
                id="target-value" 
                type="number" 
                value={targetValue} 
                onChange={e => setTargetValue(e.target.value)} 
                required
                step="any"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input 
                id="unit" 
                value={unit} 
                onChange={e => setUnit(e.target.value)} 
                placeholder="kg, min, km, etc."
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editGoal ? "Update Goal" : "Save Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}