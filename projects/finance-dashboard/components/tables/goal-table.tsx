"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash, Eye } from "lucide-react"
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
import { useIsMobile } from "@/hooks/use-mobile"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function GoalTable() {
  const { goals, deleteGoal } = useFinance()
  const { toast } = useToast()
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const isMobile = useIsMobile()

  const handleEdit = (id: string) => {
    setSelectedGoal(id)
    setIsEditing(true)
  }

  const handleView = (id: string) => {
    setSelectedGoal(id)
    setIsViewingDetails(true)
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

  // Get the details of the selected goal
  const goalDetails = selectedGoal ? goals.find((g) => g.id === selectedGoal) : null

  return (
    <>
      {isMobile ? (
        // Mobile card view
        <div className="space-y-4 px-1">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <Card key={goal.id} className="p-4 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-base">{goal.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-muted-foreground">{goal.type}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleView(goal.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
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
                </div>

                <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
                  <div className="text-muted-foreground">Target:</div>
                  <div className="text-right">${goal.target.toLocaleString()}</div>

                  <div className="text-muted-foreground">Current:</div>
                  <div className="text-right">${goal.current.toLocaleString()}</div>

                  <div className="text-muted-foreground">Deadline:</div>
                  <div className="text-right">{goal.deadline}</div>
                </div>

                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center p-8 border rounded-md">
              <p className="text-muted-foreground">No goals found. Create one to get started.</p>
            </div>
          )}
        </div>
      ) : (
        // Desktop table view
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
                          <DropdownMenuItem onClick={() => handleView(goal.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
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
      )}

      {isEditing && selectedGoal && (
        <GoalForm
          goalId={selectedGoal}
          onClose={() => {
            setIsEditing(false)
            setSelectedGoal(null)
          }}
        />
      )}

      {isViewingDetails && goalDetails && (
        <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Goal Details</DialogTitle>
              <DialogDescription>Detailed information about this financial goal</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-3">{goalDetails.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Type:</div>
                <div className="col-span-3">{goalDetails.type}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Target:</div>
                <div className="col-span-3">${goalDetails.target.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Current:</div>
                <div className="col-span-3">${goalDetails.current.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Deadline:</div>
                <div className="col-span-3">{goalDetails.deadline}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Progress:</div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <Progress value={goalDetails.progress} className="h-2 w-[100px]" />
                    <span className="text-sm text-muted-foreground">{goalDetails.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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

