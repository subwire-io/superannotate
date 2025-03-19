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
import { Exercise, ExerciseCategory, Workout, WorkoutExercise } from "@/types";
import { exercises } from "@/lib/data";
import { generateId } from "@/lib/utils";
import { X, Plus } from "lucide-react";

interface WorkoutFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (workout: Workout) => void;
  editWorkout?: Workout;
}

export function WorkoutForm({ open, onClose, onSave, editWorkout }: WorkoutFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  
  useEffect(() => {
    if (editWorkout) {
      setTitle(editWorkout.title);
      setDate(editWorkout.date.split('T')[0]);
      setDuration(editWorkout.duration.toString());
      setNotes(editWorkout.notes || "");
      setWorkoutExercises(editWorkout.exercises);
    } else {
      resetForm();
    }
  }, [editWorkout, open]);
  
  const resetForm = () => {
    setTitle("");
    setDate(new Date().toISOString().split('T')[0]);
    setDuration("");
    setNotes("");
    setWorkoutExercises([]);
  };
  
  const handleAddExercise = () => {
    const newExercise: WorkoutExercise = {
      id: generateId(),
      exerciseId: exercises[0].id,
      sets: [
        {
          id: generateId(),
          reps: 0,
          weight: 0,
          completed: false
        }
      ],
      notes: ""
    };
    
    setWorkoutExercises([...workoutExercises, newExercise]);
  };
  
  const handleRemoveExercise = (id: string) => {
    setWorkoutExercises(workoutExercises.filter(exercise => exercise.id !== id));
  };
  
  const handleExerciseChange = (id: string, exerciseId: string) => {
    setWorkoutExercises(workoutExercises.map(exercise => {
      if (exercise.id === id) {
        return { ...exercise, exerciseId };
      }
      return exercise;
    }));
  };
  
  const handleAddSet = (exerciseId: string) => {
    setWorkoutExercises(workoutExercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              id: generateId(),
              reps: 0,
              weight: 0,
              completed: false
            }
          ]
        };
      }
      return exercise;
    }));
  };
  
  const handleRemoveSet = (exerciseId: string, setId: string) => {
    setWorkoutExercises(workoutExercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.filter(set => set.id !== setId)
        };
      }
      return exercise;
    }));
  };
  
  const handleSetChange = (exerciseId: string, setId: string, key: string, value: number) => {
    setWorkoutExercises(workoutExercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map(set => {
            if (set.id === setId) {
              return { ...set, [key]: value };
            }
            return set;
          })
        };
      }
      return exercise;
    }));
  };
  
  const handleExerciseNotesChange = (id: string, notes: string) => {
    setWorkoutExercises(workoutExercises.map(exercise => {
      if (exercise.id === id) {
        return { ...exercise, notes };
      }
      return exercise;
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const workout: Workout = {
      id: editWorkout ? editWorkout.id : generateId(),
      title,
      date: new Date(date).toISOString(),
      exercises: workoutExercises,
      duration: parseInt(duration),
      notes: notes || undefined,
      completed: true
    };
    
    onSave(workout);
    onClose();
  };
  
  const getExercisesByCategory = (category: ExerciseCategory): Exercise[] => {
    return exercises.filter(exercise => exercise.category === category);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editWorkout ? "Edit Workout" : "Add New Workout"}</DialogTitle>
          <DialogDescription>
            {editWorkout ? "Update your workout details" : "Create a new workout session"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Workout Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Upper Body, Leg Day, etc."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration" 
                type="number" 
                value={duration} 
                onChange={e => setDuration(e.target.value)} 
                min="1"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              placeholder="How did you feel? What could be improved?"
            />
          </div>
          
          <div>
            <Label>Exercises</Label>
            <div className="space-y-4 mt-2">
              {workoutExercises.map((workoutExercise, index) => {
                const exercise = exercises.find(ex => ex.id === workoutExercise.exerciseId);
                const isCardio = exercise?.category === 'cardio';
                
                return (
                  <div key={workoutExercise.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Exercise {index + 1}</h4>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveExercise(workoutExercise.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove exercise</span>
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor={`exercise-${workoutExercise.id}`}>
                          Exercise Type
                        </Label>
                        <Select 
                          value={workoutExercise.exerciseId}
                          onValueChange={value => handleExerciseChange(workoutExercise.id, value)}
                        >
                          <SelectTrigger id={`exercise-${workoutExercise.id}`}>
                            <SelectValue placeholder="Select an exercise" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="strength" disabled>Strength</SelectItem>
                            {getExercisesByCategory('strength').map(ex => (
                              <SelectItem key={ex.id} value={ex.id}>
                                {ex.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="cardio" disabled>Cardio</SelectItem>
                            {getExercisesByCategory('cardio').map(ex => (
                              <SelectItem key={ex.id} value={ex.id}>
                                {ex.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="flexibility" disabled>Flexibility</SelectItem>
                            {getExercisesByCategory('flexibility').map(ex => (
                              <SelectItem key={ex.id} value={ex.id}>
                                {ex.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`notes-${workoutExercise.id}`}>
                          Exercise Notes (optional)
                        </Label>
                        <Input 
                          id={`notes-${workoutExercise.id}`}
                          value={workoutExercise.notes || ""}
                          onChange={e => handleExerciseNotesChange(workoutExercise.id, e.target.value)}
                          placeholder="Any specific notes for this exercise"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Sets</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddSet(workoutExercise.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Set
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {workoutExercise.sets.map((set, setIndex) => (
                          <div key={set.id} className="flex items-center gap-2">
                            <span className="text-sm font-medium w-10">
                              Set {setIndex + 1}
                            </span>
                            
                            {isCardio ? (
                              <>
                                <div className="flex-1">
                                  <Label htmlFor={`duration-${set.id}`} className="sr-only">
                                    Duration (seconds)
                                  </Label>
                                  <Input 
                                    id={`duration-${set.id}`}
                                    type="number"
                                    placeholder="Duration (sec)"
                                    value={set.duration || ""}
                                    onChange={e => handleSetChange(
                                      workoutExercise.id, 
                                      set.id, 
                                      'duration', 
                                      parseInt(e.target.value)
                                    )}
                                  />
                                </div>
                                
                                <div className="flex-1">
                                  <Label htmlFor={`distance-${set.id}`} className="sr-only">
                                    Distance (meters)
                                  </Label>
                                  <Input 
                                    id={`distance-${set.id}`}
                                    type="number"
                                    placeholder="Distance (m)"
                                    value={set.distance || ""}
                                    onChange={e => handleSetChange(
                                      workoutExercise.id, 
                                      set.id, 
                                      'distance', 
                                      parseInt(e.target.value)
                                    )}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex-1">
                                  <Label htmlFor={`reps-${set.id}`} className="sr-only">
                                    Reps
                                  </Label>
                                  <Input 
                                    id={`reps-${set.id}`}
                                    type="number"
                                    placeholder="Reps"
                                    value={set.reps || ""}
                                    onChange={e => handleSetChange(
                                      workoutExercise.id, 
                                      set.id, 
                                      'reps', 
                                      parseInt(e.target.value)
                                    )}
                                  />
                                </div>
                                
                                <div className="flex-1">
                                  <Label htmlFor={`weight-${set.id}`} className="sr-only">
                                    Weight (kg)
                                  </Label>
                                  <Input 
                                    id={`weight-${set.id}`}
                                    type="number"
                                    placeholder="Weight (kg)"
                                    value={set.weight || ""}
                                    onChange={e => handleSetChange(
                                      workoutExercise.id, 
                                      set.id, 
                                      'weight', 
                                      parseInt(e.target.value)
                                    )}
                                  />
                                </div>
                              </>
                            )}
                            
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveSet(workoutExercise.id, set.id)}
                              disabled={workoutExercise.sets.length <= 1}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove set</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleAddExercise}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={workoutExercises.length === 0}>
              {editWorkout ? "Update Workout" : "Save Workout"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}