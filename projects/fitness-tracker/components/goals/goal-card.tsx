import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Goal } from "@/types";
import {
    calculateDaysRemaining,
    calculateGoalPercentage,
    formatDate
} from "@/lib/utils";
import { ProgressRing } from "../ui/progress-ring";
import { CalendarClock, Target, Edit, Trash2 } from "lucide-react";

interface GoalCardProps {
    goal: Goal;
    onEdit: (goal: Goal) => void;
    onDelete: (goalId: string) => void;
    onToggleComplete: (goal: Goal, completed: boolean) => void;
    onUpdateProgress: (goal: Goal, newValue: number) => void;
}

export function GoalCard({
    goal,
    onEdit,
    onDelete,
    onToggleComplete,
    onUpdateProgress
}: GoalCardProps) {
    const progress = calculateGoalPercentage(goal.currentValue, goal.targetValue);
    const daysRemaining = goal.deadline ? calculateDaysRemaining(goal.deadline) : null;

    const handleProgressUpdate = () => {
        const newValue = prompt("Enter new current value:", goal.currentValue.toString());
        if (newValue !== null) {
            const parsedValue = parseFloat(newValue);
            if (!isNaN(parsedValue)) {
                onUpdateProgress(goal, parsedValue);
            }
        }
    };

    return (
        <Card className={goal.completed ? "opacity-75" : ""}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id={`complete - ${goal.id}`}
                            checked={goal.completed}
                            onCheckedChange={(checked: boolean) =>
                                onToggleComplete(goal, checked as boolean)
                            }
                        />
                        <CardTitle className="text-lg">
                            <label
                                htmlFor={`complete-${goal.id}`}
                                className={goal.completed ? "line-through text-muted-foreground" : ""}
                            >
                                {goal.title}
                            </label>
                        </CardTitle>
                    </div>
                    <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit goal</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete goal</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4">
                    <ProgressRing progress={progress} size={80} strokeWidth={8} className="text-primary">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-full w-full rounded-full p-0"
                            onClick={handleProgressUpdate}
                            disabled={goal.completed}
                        >
                            <span className="sr-only">Update progress</span>
                            <span className="text-lg font-medium">{progress}%</span>
                        </Button>
                    </ProgressRing>
                    <div className="flex-1 space-y-2">
                        {goal.description && (
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                        )}

                        <div className="flex flex-wrap gap-2 text-sm">
                            <Badge variant={goal.category === 'strength' ? 'default' :
                                goal.category === 'cardio' ? 'secondary' :
                                    goal.category === 'weight' ? 'outline' : 'destructive'}>
                                {goal.category}
                            </Badge>

                            {goal.deadline && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <CalendarClock className="h-3 w-3" />
                                    <span className={daysRemaining && daysRemaining < 7 ? "text-destructive" : ""}>
                                        {daysRemaining} days left
                                    </span>
                                </Badge>
                            )}
                        </div>
                        <div className="text-sm grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-muted-foreground">Current: </span>
                                <span className="font-medium">{goal.currentValue} {goal.unit}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Target: </span>
                                <span className="font-medium">{goal.targetValue} {goal.unit}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card >
    );
}