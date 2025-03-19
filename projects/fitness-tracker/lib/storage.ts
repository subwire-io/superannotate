import { Goal, User, Workout } from "@/types";
import { sampleGoals, sampleWorkouts } from "./data";

// Key for localStorage
const USER_STORAGE_KEY = "fitness-tracker-user";

// Initialize user data from localStorage or use sample data
export function initUserData(): User {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(USER_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  }
  
  // Default data
  return {
    workouts: sampleWorkouts,
    goals: sampleGoals
  };
}

// Save user data to localStorage
export function saveUserData(userData: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }
}

// Add a new workout
export function addWorkout(workout: Workout): void {
  const userData = initUserData();
  userData.workouts = [...userData.workouts, workout];
  saveUserData(userData);
}

// Update an existing workout
export function updateWorkout(updatedWorkout: Workout): void {
  const userData = initUserData();
  userData.workouts = userData.workouts.map(workout => 
    workout.id === updatedWorkout.id ? updatedWorkout : workout
  );
  saveUserData(userData);
}

// Delete a workout
export function deleteWorkout(workoutId: string): void {
  const userData = initUserData();
  userData.workouts = userData.workouts.filter(workout => workout.id !== workoutId);
  saveUserData(userData);
}

// Add a new goal
export function addGoal(goal: Goal): void {
  const userData = initUserData();
  userData.goals = [...userData.goals, goal];
  saveUserData(userData);
}

// Update an existing goal
export function updateGoal(updatedGoal: Goal): void {
  const userData = initUserData();
  userData.goals = userData.goals.map(goal => 
    goal.id === updatedGoal.id ? updatedGoal : goal
  );
  saveUserData(userData);
}

// Delete a goal
export function deleteGoal(goalId: string): void {
  const userData = initUserData();
  userData.goals = userData.goals.filter(goal => goal.id !== goalId);
  saveUserData(userData);
}

// Update user profile
export function updateUserProfile(weight?: number, height?: number): void {
  const userData = initUserData();
  if (weight !== undefined) userData.weight = weight;
  if (height !== undefined) userData.height = height;
  saveUserData(userData);
}