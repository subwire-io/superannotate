"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WorkoutCard } from "@/components/workouts/workout-card"
import { WorkoutForm } from "@/components/workouts/workout-form"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { User, Workout } from "@/types"
import { addWorkout, deleteWorkout, updateWorkout } from "@/lib/storage"
import { Dumbbell, Plus } from "lucide-react"

interface WorkoutsViewProps {
    userData: User
    onWorkoutsChange: () => void
}

export function WorkoutsView({ userData, onWorkoutsChange }: WorkoutsViewProps) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editWorkout, setEditWorkout] = useState<Workout | undefined>(undefined)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null)

    // Sort workouts by date (newest first)
    const sortedWorkouts = [...userData.workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const handleAddWorkout = () => {
        setEditWorkout(undefined)
        setIsFormOpen(true)
    }

    const handleEditWorkout = (workout: Workout) => {
        setEditWorkout(workout)
        setIsFormOpen(true)
    }

    const handleSaveWorkout = (workout: Workout) => {
        if (editWorkout) {
            updateWorkout(workout)
        } else {
            addWorkout(workout)
        }
        onWorkoutsChange()
    }

    const handleDeleteClick = (workoutId: string) => {
        setWorkoutToDelete(workoutId)
        setDeleteConfirmOpen(true)
    }

    const handleConfirmDelete = () => {
        if (workoutToDelete) {
            deleteWorkout(workoutToDelete)
            setWorkoutToDelete(null)
            onWorkoutsChange()
        }
        setDeleteConfirmOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
                <Button onClick={handleAddWorkout}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Workout
                </Button>
            </div>

            {sortedWorkouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Dumbbell className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-medium">No workouts yet</h2>
                    <p className="text-muted-foreground mt-1">Start by adding your first workout session</p>
                    <Button className="mt-4" onClick={handleAddWorkout}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Workout
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedWorkouts.map((workout) => (
                        <WorkoutCard key={workout.id} workout={workout} onEdit={handleEditWorkout} onDelete={handleDeleteClick} />
                    ))}
                </div>
            )}

            <WorkoutForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSaveWorkout}
                editWorkout={editWorkout}
            />

            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the selected workout and all its data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

