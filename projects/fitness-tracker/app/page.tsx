"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import { initUserData } from "@/lib/storage";
import { Navigation } from "@/components/navigation";
import { DashboardPage } from "./dashboard/page";
import { GoalsPage } from "./goals/page";
import { WorkoutsPage } from "./workouts/page";
import { ProfilePage } from "./profile/page";
import { WorkoutForm } from "@/components/workouts/workout-form";
import { GoalForm } from "@/components/goals/goal-form";
import { addWorkout, addGoal } from "@/lib/storage";

export default function FitnessTracker() {
  const [userData, setUserData] = useState<User>({
    workouts: [],
    goals: [],
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [addWorkoutOpen, setAddWorkoutOpen] = useState(false);
  const [addGoalOpen, setAddGoalOpen] = useState(false);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const data = initUserData();
    setUserData(data);
  }, []);

  // Update userData when things change
  const refreshUserData = () => {
    const data = initUserData();
    setUserData(data);
  };

  // Handlers for adding workouts and goals
  const handleAddWorkout = () => {
    setAddWorkoutOpen(true);
  };

  const handleAddGoal = () => {
    setAddGoalOpen(true);
  };

  const handleSaveWorkout = (workout: any) => {
    addWorkout(workout);
    refreshUserData();
  };

  const handleSaveGoal = (goal: any) => {
    addGoal(goal);
    refreshUserData();
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4">
            <h1 className="font-bold text-xl flex items-center mr-8">
              <span className="text-primary mr-1">Super Fit</span>
            </h1>

            <Navigation activeTab={activeTab} onChangeTab={setActiveTab} />
          </div>
        </header>

        <div className="flex-1 container py-6 px-4">
          {activeTab === "dashboard" && (
            <DashboardPage
              onAddWorkout={handleAddWorkout}
              onAddGoal={handleAddGoal}
              userData={userData}
            />
          )}

          {activeTab === "workouts" && (
            <WorkoutsPage
              userData={userData}
              onWorkoutsChange={refreshUserData}
            />
          )}

          {activeTab === "goals" && (
            <GoalsPage userData={userData} onGoalsChange={refreshUserData} />
          )}

          {activeTab === "profile" && (
            <ProfilePage
              userData={userData}
              onProfileChange={refreshUserData}
            />
          )}
        </div>
      </div>

      <WorkoutForm
        open={addWorkoutOpen}
        onClose={() => setAddWorkoutOpen(false)}
        onSave={handleSaveWorkout}
      />

      <GoalForm
        open={addGoalOpen}
        onClose={() => setAddGoalOpen(false)}
        onSave={handleSaveGoal}
      />
    </main>
  );
}
