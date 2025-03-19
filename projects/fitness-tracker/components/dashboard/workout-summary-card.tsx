import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Workout, WorkoutSummary } from "@/types";
  import { Dumbbell, Calendar, Clock, Award } from "lucide-react";
  import { calculateWorkoutSummary } from "@/lib/data";
  import { formatDate } from "@/lib/utils";
  
  interface WorkoutSummaryCardProps {
    workouts: Workout[];
  }
  
  export function WorkoutSummaryCard({ workouts }: WorkoutSummaryCardProps) {
    const summary = calculateWorkoutSummary(workouts);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Workout Summary
          </CardTitle>
          <CardDescription>
            Your workout statistics and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Total Workouts
            </span>
            <span className="text-3xl font-bold">{summary.totalWorkouts}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              This Week
            </span>
            <span className="text-3xl font-bold">{summary.thisWeek}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Total Minutes
            </span>
            <span className="text-3xl font-bold">{summary.totalDuration}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1 flex items-center">
              <Award className="h-3 w-3 mr-1" />
              Top Exercise
            </span>
            <span className="text-base font-medium truncate">{summary.topExercise}</span>
          </div>
          {summary.lastWorkout && (
            <div className="col-span-2">
              <span className="text-xs text-muted-foreground mb-1 block">Last Workout</span>
              <span className="text-sm">{formatDate(summary.lastWorkout)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }