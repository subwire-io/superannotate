'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalForm } from "@/components/goals/goal-form";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Goal, User } from "@/types";
import {
    addGoal,
    deleteGoal,
    initUserData,
    updateGoal
} from "@/lib/storage";
import { Plus, Target } from "lucide-react";

interface GoalsPageProps {
    userData: User;
    onGoalsChange: () => void;
}

export function GoalsPage({ userData, onGoalsChange }: GoalsPageProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editGoal, setEditGoal] = useState<Goal | undefined>(undefined);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

    // Show active goals first, then sort by creation date
    const sortedGoals = [...userData.goals].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const handleAddGoal = () => {
        setEditGoal(undefined);
        setIsFormOpen(true);
    };

    const handleEditGoal = (goal: Goal) => {
        setEditGoal(goal);
        setIsFormOpen(true);
    };

    const handleSaveGoal = (goal: Goal) => {
        if (editGoal) {
            updateGoal(goal);
        } else {
            addGoal(goal);
        }
        onGoalsChange();
    };

    const handleDeleteClick = (goalId: string) => {
        setGoalToDelete(goalId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (goalToDelete) {
            deleteGoal(goalToDelete);
            setGoalToDelete(null);
            onGoalsChange();
        }
        setDeleteConfirmOpen(false);
    };

    const handleToggleComplete = (goal: Goal, completed: boolean) => {
        updateGoal({ ...goal, completed });
        onGoalsChange();
    };

    const handleUpdateProgress = (goal: Goal, newValue: number) => {
        updateGoal({ ...goal, currentValue: newValue });
        onGoalsChange();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
                <Button onClick={handleAddGoal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                </Button>
            </div>

            {sortedGoals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Target className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-medium">No goals yet</h2>
                    <p className="text-muted-foreground mt-1">
                        Start by setting your first fitness goal
                    </p>
                    <Button className="mt-4" onClick={handleAddGoal}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Goal
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedGoals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onEdit={handleEditGoal}
                            onDelete={handleDeleteClick}
                            onToggleComplete={handleToggleComplete}
                            onUpdateProgress={handleUpdateProgress}
                        />
                    ))}
                </div>
            )}

            <GoalForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSaveGoal}
                editGoal={editGoal}
            />

            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            selected goal.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}