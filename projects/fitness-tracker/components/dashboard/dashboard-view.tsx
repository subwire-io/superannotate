"use client"
import { WorkoutSummaryCard } from "@/components/dashboard/workout-summary-card"
import { GoalProgressCard } from "@/components/dashboard/goal-progress-card"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { ExerciseDistribution } from "@/components/dashboard/exercise-distribution"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import type { User } from "@/types"

interface DashboardViewProps {
    onAddWorkout: () => void
    onAddGoal: () => void
    userData: User
}

export function DashboardView({ onAddWorkout, onAddGoal, userData }: DashboardViewProps) {
    return (
        <div className="space-y-6">
            <DashboardHeader onAddWorkout={onAddWorkout} onAddGoal={onAddGoal} />

            <div className="grid gap-6 md:grid-cols-2">
                <WorkoutSummaryCard workouts={userData.workouts} />
                <GoalProgressCard goals={userData.goals} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <ActivityChart workouts={userData.workouts} />
                <ExerciseDistribution workouts={userData.workouts} />
            </div>
        </div>
    )
}

