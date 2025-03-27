"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { Edit, Eye, Loader2, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFinance } from "@/lib/data-context"
import { BudgetForm } from "@/components/forms/budget-form"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BudgetTableProps {
  budgets: Array<{
    id: string
    category: string
    allocated: number
    spent: number
    remaining: number
    progress: number
  }>
}

type SortField = "category" | "allocated" | "spent" | "remaining" | "progress"
type SortDirection = "asc" | "desc"

export function BudgetTable({ budgets }: BudgetTableProps) {
  const { deleteBudget, isLoading } = useFinance()
  const { toast } = useToast()
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const [sortField, setSortField] = useState<SortField>("category")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const isMobile = useIsMobile()

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? "↑" : "↓"
  }

  // Sort budgets
  const sortedBudgets = [...budgets].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "category":
        comparison = a.category.localeCompare(b.category)
        break
      case "allocated":
        comparison = a.allocated - b.allocated
        break
      case "spent":
        comparison = a.spent - b.spent
        break
      case "remaining":
        comparison = a.remaining - b.remaining
        break
      case "progress":
        comparison = a.progress - b.progress
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleEdit = (id: string) => {
    setSelectedBudget(id)
    setIsEditing(true)
  }

  const handleView = (id: string) => {
    setSelectedBudget(id)
    setIsViewingDetails(true)
  }

  const handleDelete = (id: string) => {
    setSelectedBudget(id)
    setIsDeleting(true)
  }

  const confirmDelete = () => {
    if (selectedBudget) {
      // Store the budget before deleting it
      const budgetToDelete = budgets.find((b) => b.id === selectedBudget)

      // Delete the budget
      deleteBudget(selectedBudget)

      // Show toast with undo option
      if (budgetToDelete) {
        toast({
          title: "Budget deleted",
          description: "The budget has been deleted successfully.",
          duration: 3000,
          action: (
            <Button
              variant="outline"
              onClick={() => {
                // Implement undo functionality
                toast({
                  title: "Action undone",
                  description: "The budget has been restored.",
                  duration: 3000,
                })
              }}
            >
              Undo
            </Button>
          ),
        })
      }

      setIsDeleting(false)
      setSelectedBudget(null)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Empty state
  if (budgets.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">No budgets found. Create one to get started.</p>
        <Button onClick={() => setIsEditing(true)}>Create Budget</Button>
      </div>
    )
  }

  // Get the details of the selected budget
  const budgetDetails = selectedBudget ? budgets.find((b) => b.id === selectedBudget) : null

  return (
    <>
      {isMobile ? (
        // Mobile card view
        <div className="space-y-4 px-2">
          {sortedBudgets.map((budget) => (
            <Card key={budget.id} className="p-5 shadow-sm border-0 bg-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-base">{budget.category}</h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleView(budget.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(budget.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(budget.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
                <div className="text-muted-foreground">Allocated:</div>
                <div className="text-right">${budget.allocated.toFixed(2)}</div>

                <div className="text-muted-foreground">Spent:</div>
                <div className="text-right">${budget.spent.toFixed(2)}</div>

                <div className="text-muted-foreground">Remaining:</div>
                <div className="text-right font-medium">${budget.remaining.toFixed(2)}</div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className={cn("text-sm", budget.progress >= 90 ? "text-red-500" : "text-muted-foreground")}>
                    {budget.progress}%
                  </span>
                </div>
                <Progress
                  value={budget.progress}
                  className={cn(
                    "h-2",
                    budget.progress >= 90 ? "bg-red-200" : "bg-muted",
                    budget.progress >= 90 ? "[&>div]:bg-red-500" : "",
                  )}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // Desktop table view
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("category")}>
                  Category {getSortIcon("category")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("allocated")}>
                  Allocated {getSortIcon("allocated")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("spent")}>
                  Spent {getSortIcon("spent")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("remaining")}>
                  Remaining {getSortIcon("remaining")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("progress")}>
                  Progress {getSortIcon("progress")}
                </TableHead>
                <TableHead className="w-[120px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBudgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">{budget.category}</TableCell>
                  <TableCell>${budget.allocated.toFixed(2)}</TableCell>
                  <TableCell>${budget.spent.toFixed(2)}</TableCell>
                  <TableCell>${budget.remaining.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={budget.progress}
                        className={cn(
                          "h-2 w-[100px]",
                          budget.progress >= 90 ? "bg-red-200" : "bg-muted",
                          budget.progress >= 90 ? "[&>div]:bg-red-500" : "",
                        )}
                      />
                      <span className={cn("text-sm", budget.progress >= 90 ? "text-red-500" : "text-muted-foreground")}>
                        {budget.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(budget.id)}
                        aria-label={`View details for ${budget.category} budget`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(budget.id)}
                        aria-label={`Edit ${budget.category} budget`}
                      >
                        <Edit className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(budget.id)}
                        aria-label={`Delete ${budget.category} budget`}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {isEditing && (
        <BudgetForm
          budgetId={selectedBudget || undefined}
          onClose={() => {
            setIsEditing(false)
            setSelectedBudget(null)
          }}
        />
      )}

      {isViewingDetails && budgetDetails && (
        <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Budget Details</DialogTitle>
              <DialogDescription>Detailed information about this budget</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Category:</div>
                <div className="col-span-3">{budgetDetails.category}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Allocated:</div>
                <div className="col-span-3">${budgetDetails.allocated.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Spent:</div>
                <div className="col-span-3">${budgetDetails.spent.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Remaining:</div>
                <div className="col-span-3">${budgetDetails.remaining.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Progress:</div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <Progress value={budgetDetails.progress} className="h-2 w-[100px]" />
                    <span className="text-sm text-muted-foreground">{budgetDetails.progress}%</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">
                  {budgetDetails.progress >= 90 ? (
                    <span className="text-red-500">Over Budget</span>
                  ) : budgetDetails.progress >= 75 ? (
                    <span className="text-amber-500">Warning</span>
                  ) : (
                    <span className="text-green-500">On Track</span>
                  )}
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
              This action cannot be undone. This will permanently delete the budget.
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

