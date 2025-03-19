import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Exercise, Workout } from "@/types";
import { formatDate } from "@/lib/utils";
import { getExerciseById } from "@/lib/data";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";

interface WorkoutCardProps {
  workout: Workout;
  onEdit: (workout: Workout) => void;
  onDelete: (workoutId: string) => void;
}

export function WorkoutCard({ workout, onEdit, onDelete }: WorkoutCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="mb-1">{workout.title}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground space-x-3">
              <span className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {formatDate(workout.date)}
              </span>
              <span className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {workout.duration} min
              </span>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(workout)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit workout</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(workout.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete workout</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {workout.exercises.map((workoutExercise) => {
            const exercise = getExerciseById(workoutExercise.exerciseId);
            if (!exercise) return null;
            
            return (
              <div key={workoutExercise.id} className="text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{exercise.name}</span>
                  <Badge variant="outline">{exercise.category}</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
                  {workoutExercise.sets.map((set, index) => (
                    <div key={set.id} className="border rounded px-2 py-1">
                      <span>Set {index + 1}: </span>
                      {set.reps && <span>{set.reps} reps </span>}
                      {set.weight && <span>{set.weight} kg </span>}
                      {set.duration && <span>{Math.floor(set.duration / 60)}:{(set.duration % 60).toString().padStart(2, '0')} </span>}
                      {set.distance && <span>{set.distance}m </span>}
                    </div>
                  ))}
                </div>
                
                {workoutExercise.notes && (
                  <p className="text-xs mt-1 italic">{workoutExercise.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}