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
import { useToast } from "@/hooks/use-toast"

export function BudgetTable() {
  const { budgets, deleteBudget } = useFinance()
  const { toast } = useToast()
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (id: string) => {
    setSelectedBudget(id)
    setIsEditing(true)
  }

  const handleDelete = (id: string) => {
    setSelectedBudget(id)
    setIsDeleting(true)
  }

  const confirmDelete = () => {
    if (selectedBudget) {
      deleteBudget(selectedBudget)
      toast({
        title: "Budget deleted",
        description: "The budget has been deleted successfully.",
        action: (
          <Button
            variant="outline"
            onClick={() => {
              // Implement undo functionality
              toast({
                title: "Action undone",
                description: "The budget has been restored.",
              })
            }}
          >
            Undo
          </Button>
        ),
      })
      setIsDeleting(false)
      setSelectedBudget(null)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Allocated</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.length > 0 ? (
              budgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">{budget.category}</TableCell>
                  <TableCell>${budget.allocated.toFixed(2)}</TableCell>
                  <TableCell>${budget.spent.toFixed(2)}</TableCell>
                  <TableCell>${budget.remaining.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={budget.progress} className="h-2 w-[100px]" />
                      <span className="text-sm text-muted-foreground">{budget.progress}%</span>
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No budgets found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isEditing && selectedBudget && (
        <BudgetForm
          budgetId={selectedBudget}
          onClose={() => {
            setIsEditing(false)
            setSelectedBudget(null)
          }}
        />
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

