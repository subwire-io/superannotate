import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Goal } from "@/types";
import { calculateDaysRemaining, calculateGoalPercentage, formatDate } from "@/lib/utils";
import { ProgressRing } from "../ui/progress-ring";
import { Target } from "lucide-react";

interface GoalProgressCardProps {
  goals: Goal[];
}

export function GoalProgressCard({ goals }: GoalProgressCardProps) {
  const activeGoals = goals.filter(goal => !goal.completed);
  
  if (activeGoals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <p className="text-muted-foreground text-center">
            No active goals. Add a new goal to track your progress.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {activeGoals.map(goal => {
          const progress = calculateGoalPercentage(goal.currentValue, goal.targetValue);
          const daysRemaining = goal.deadline 
            ? calculateDaysRemaining(goal.deadline)
            : null;
            
          return (
            <div key={goal.id} className="flex items-center gap-4">
              <ProgressRing progress={progress} size={80} strokeWidth={8}>
                <span className="text-lg font-medium">{progress}%</span>
              </ProgressRing>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{goal.title}</h3>
                  <Badge variant={goal.category === 'strength' ? 'default' : 
                               goal.category === 'cardio' ? 'secondary' : 
                               goal.category === 'weight' ? 'outline' : 'destructive'}>
                    {goal.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
                <div className="flex justify-between text-sm">
                  <span>
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </span>
                  {daysRemaining !== null && (
                    <span className={`${daysRemaining < 7 ? 'text-destructive' : ''}`}>
                      {daysRemaining} days left
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}