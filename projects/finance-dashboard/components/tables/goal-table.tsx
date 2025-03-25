"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFinance } from "@/lib/data-context"
import { GoalForm } from "@/components/forms/goal-form"
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
import { useToast } from "@/hooks/use-toast"

export function GoalTable() {
  const { goals, deleteGoal } = useFinance()
  const { toast } = useToast()
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (id: string) => {
    setSelectedGoal(id)
    setIsEditing(true)
  }

  const handleDelete = (id: string) => {
    setSelectedGoal(id)
    setIsDeleting(true)
  }

  const confirmDelete = () => {
    if (selectedGoal) {
      deleteGoal(selectedGoal)
      toast({
        title: "Goal deleted",
        description: "The financial goal has been deleted successfully.",
        action: (
          <Button
            variant="outline"
            onClick={() => {
              // Implement undo functionality
              toast({
                title: "Action undone",
                description: "The goal has been restored.",
              })
            }}
          >
            Undo
          </Button>
        ),
      })
      setIsDeleting(false)
      setSelectedGoal(null)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Goal</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.length > 0 ? (
              goals.map((goal) => (
                <TableRow key={goal.id}>
                  <TableCell className="font-medium">{goal.name}</TableCell>
                  <TableCell>{goal.type}</TableCell>
                  <TableCell>${goal.target.toLocaleString()}</TableCell>
                  <TableCell>${goal.current.toLocaleString()}</TableCell>
                  <TableCell>{goal.deadline}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={goal.progress} className="h-2 w-[100px]" />
                      <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(goal.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(goal.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No goals found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isEditing && selectedGoal && (
        <GoalForm
          goalId={selectedGoal}
          onClose={() => {
            setIsEditing(false)
            setSelectedGoal(null)
          }}
        />
      )}

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the financial goal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

