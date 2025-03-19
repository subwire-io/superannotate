export type ExerciseCategory =
| 'strength'
| 'cardio'
| 'flexibility'
| 'balance'
| 'sports';
export interface Exercise {
    id: string;
    name: string;
    category: ExerciseCategory;
    muscleGroups?: string[];
    description?: string;
}

export interface ExerciseSet {
    id: string;
    reps?: number;
    weight?: number; // in kg
    duration?: number; // in seconds
    distance?: number; // in meters
    completed: boolean;
}

export interface WorkoutExercise {
    id: string;
    exerciseId: string;
    sets: ExerciseSet[];
    notes?: string;
}

export interface Workout {
    id: string;
    date: string; // ISO string
    title: string;
    exercises: WorkoutExercise[];
    duration: number; // in minutes
    notes?: string;
    completed: boolean;
}

export interface Goal {
    id: string;
    title: string;
    description?: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline?: string; // ISO string
    category: 'strength' | 'cardio' | 'weight' | 'custom';
    completed: boolean;
    createdAt: string; // ISO string
}

export interface User {
    weight?: number; // in kg
    height?: number; // in cm
    goals: Goal[];
    workouts: Workout[];
}

export interface WorkoutSummary {
    totalWorkouts: number;
    thisWeek: number;
    totalDuration: number;
    topExercise: string;
    exerciseCount: Record<string, number>;
    lastWorkout?: string;
}