import { Exercise, ExerciseCategory, Goal, Workout, WorkoutSummary } from "@/types";

// Sample exercise data
export const exercises: Exercise[] = [
  {
    id: "ex1",
    name: "Barbell Squat",
    category: "strength",
    muscleGroups: ["quadriceps", "glutes", "hamstrings", "lower back"],
    description: "A compound exercise that works multiple muscle groups in the lower body"
  },
  {
    id: "ex2",
    name: "Bench Press",
    category: "strength",
    muscleGroups: ["chest", "shoulders", "triceps"],
    description: "A compound upper body exercise that targets the chest, shoulders, and triceps"
  },
  {
    id: "ex3",
    name: "Deadlift",
    category: "strength",
    muscleGroups: ["lower back", "glutes", "hamstrings", "quadriceps", "forearms"],
    description: "A compound exercise that works nearly every muscle in the body"
  },
  {
    id: "ex4",
    name: "Pull-up",
    category: "strength",
    muscleGroups: ["lats", "biceps", "middle back", "shoulders"],
    description: "An upper body exercise that primarily targets the back and biceps"
  },
  {
    id: "ex5",
    name: "Running",
    category: "cardio",
    muscleGroups: ["quadriceps", "hamstrings", "calves", "glutes"],
    description: "A cardiovascular exercise that improves endurance and burns calories"
  },
  {
    id: "ex6",
    name: "Cycling",
    category: "cardio",
    muscleGroups: ["quadriceps", "hamstrings", "calves"],
    description: "A low-impact cardio exercise that targets the lower body"
  },
  {
    id: "ex7",
    name: "Yoga",
    category: "flexibility",
    description: "A practice that combines physical postures, breathing techniques, and meditation"
  },
  {
    id: "ex8",
    name: "Plank",
    category: "strength",
    muscleGroups: ["core", "shoulders", "back"],
    description: "An isometric core exercise that also engages the shoulders and back"
  },
];

// Sample workout data
export const sampleWorkouts: Workout[] = [
  {
    id: "w1",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Full Body Strength",
    exercises: [
      {
        id: "we1",
        exerciseId: "ex1",
        sets: [
          { id: "s1", reps: 10, weight: 60, completed: true },
          { id: "s2", reps: 10, weight: 65, completed: true },
          { id: "s3", reps: 8, weight: 70, completed: true }
        ]
      },
      {
        id: "we2",
        exerciseId: "ex2",
        sets: [
          { id: "s4", reps: 10, weight: 45, completed: true },
          { id: "s5", reps: 8, weight: 50, completed: true },
          { id: "s6", reps: 6, weight: 55, completed: true }
        ]
      },
      {
        id: "we3",
        exerciseId: "ex8",
        sets: [
          { id: "s7", duration: 60, completed: true },
          { id: "s8", duration: 45, completed: true },
          { id: "s9", duration: 30, completed: true }
        ]
      }
    ],
    duration: 60,
    completed: true
  },
  {
    id: "w2",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Cardio Session",
    exercises: [
      {
        id: "we4",
        exerciseId: "ex5",
        sets: [
          { id: "s10", duration: 1200, distance: 3000, completed: true }
        ]
      },
      {
        id: "we5",
        exerciseId: "ex6",
        sets: [
          { id: "s11", duration: 900, distance: 5000, completed: true }
        ]
      }
    ],
    duration: 35,
    completed: true
  }
];

// Sample goals data
export const sampleGoals: Goal[] = [
  {
    id: "g1",
    title: "Increase Squat",
    description: "Reach 100kg squat for 5 reps",
    targetValue: 100,
    currentValue: 80,
    unit: "kg",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: "strength",
    completed: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "g2",
    title: "Run 5K",
    description: "Complete a 5K run in under 25 minutes",
    targetValue: 25,
    currentValue: 28,
    unit: "minutes",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    category: "cardio",
    completed: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "g3",
    title: "Weight Goal",
    description: "Reach target weight of 75kg",
    targetValue: 75,
    currentValue: 80,
    unit: "kg",
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    category: "weight",
    completed: false,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Get exercises by category
export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return exercises.filter(exercise => exercise.category === category);
}

// Get exercise by id
export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(exercise => exercise.id === id);
}

// Calculate workout summary
export function calculateWorkoutSummary(workouts: Workout[]): WorkoutSummary {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);
  
  const exerciseCount: Record<string, number> = {};
  let totalDuration = 0;
  let thisWeek = 0;
  let lastWorkout: string | undefined = undefined;
  
  if (workouts.length > 0) {
    // Sort workouts by date (newest first)
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    lastWorkout = sortedWorkouts[0].date;
    
    workouts.forEach(workout => {
      // Count total duration
      totalDuration += workout.duration;
      
      // Count workouts this week
      const workoutDate = new Date(workout.date);
      if (workoutDate >= startOfWeek) {
        thisWeek++;
      }
      
      // Count exercises
      workout.exercises.forEach(exercise => {
        const exerciseId = exercise.exerciseId;
        exerciseCount[exerciseId] = (exerciseCount[exerciseId] || 0) + 1;
      });
    });
  }
  
  // Find top exercise
  let topExercise = "None";
  let maxCount = 0;
  Object.entries(exerciseCount).forEach(([id, count]) => {
    if (count > maxCount) {
      maxCount = count;
      const exercise = getExerciseById(id);
      if (exercise) {
        topExercise = exercise.name;
      }
    }
  });
  
  return {
    totalWorkouts: workouts.length,
    thisWeek,
    totalDuration,
    topExercise,
    exerciseCount,
    lastWorkout
  };
}

// Generate workout history data for charts
export function generateWorkoutHistoryData(workouts: Workout[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  const dataMap = new Map(last7Days.map(date => [date, 0]));
  
  workouts.forEach(workout => {
    const workoutDate = workout.date.split('T')[0];
    if (dataMap.has(workoutDate)) {
      dataMap.set(workoutDate, dataMap.get(workoutDate)! + 1);
    }
  });
  
  return Array.from(dataMap.entries()).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count
  }));
}

// Generate exercise distribution data for charts
export function generateExerciseDistributionData(workouts: Workout[]) {
  const categoryCount: Record<string, number> = {
    strength: 0,
    cardio: 0,
    flexibility: 0,
    balance: 0,
    sports: 0
  };
  
  workouts.forEach(workout => {
    workout.exercises.forEach(workoutExercise => {
      const exercise = getExerciseById(workoutExercise.exerciseId);
      if (exercise) {
        categoryCount[exercise.category]++;
      }
    });
  });
  
  return Object.entries(categoryCount).map(([category, count]) => ({
    category,
    count
  }));
}