"use client"

import { useState } from "react"
import { Edit, Loader2, MoreHorizontal, Receipt, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { ExpenseForm } from "@/components/forms/expense-form"
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
import { Skeleton } from "@/components/ui/skeleton"

export function ExpenseTable() {
  const { expenses, deleteExpense, addExpense, isLoading } = useFinance()
  const { toast } = useToast()
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleEdit = (id: string) => {
    setSelectedExpense(id)
    setIsEditing(true)
  }

  const handleDelete = (id: string) => {
    setSelectedExpense(id)
    setIsDeleting(true)
  }

  const confirmDelete = () => {
    if (selectedExpense) {
      const expenseToDelete = expenses.find((e) => e.id === selectedExpense)
      deleteExpense(selectedExpense)
      toast({
        title: "Expense deleted",
        description: "The expense has been deleted successfully.",
        action: (
          <Button
            variant="outline"
            onClick={() => {
              // Implement undo functionality
              if (expenseToDelete) {
                addExpense({
                  date: expenseToDelete.date,
                  description: expenseToDelete.description,
                  category: expenseToDelete.category,
                  amount: expenseToDelete.amount,
                })
                toast({
                  title: "Action undone",
                  description: "The expense has been restored.",
                })
              }
            }}
          >
            Undo
          </Button>
        ),
      })
      setIsDeleting(false)
      setSelectedExpense(null)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(expenses.map((expense) => expense.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-md border" aria-live="polite" aria-busy={true}>
        <div className="p-4 flex items-center space-x-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span>Loading expenses...</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Empty state
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md" role="status">
        <Receipt className="h-16 w-16 text-muted-foreground mb-4" aria-hidden="true" />
        <h2 className="text-xl font-medium">No expenses yet</h2>
        <p className="text-muted-foreground mt-1 max-w-sm">
          Add your first expense to start tracking your spending and manage your budget more effectively.
        </p>
        <Button className="mt-4" onClick={() => setIsEditing(true)} aria-label="Add your first expense">
          Add Expense
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table aria-label="Expense list">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedItems.length === expenses.length && expenses.length > 0}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  aria-label={
                    selectedItems.length === expenses.length ? "Deselect all expenses" : "Select all expenses"
                  }
                />
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[80px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(expense.id)}
                    onCheckedChange={(checked) => handleSelectItem(expense.id, !!checked)}
                    aria-label={
                      selectedItems.includes(expense.id)
                        ? `Deselect ${expense.description}`
                        : `Select ${expense.description}`
                    }
                  />
                </TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${expense.description}`}>
                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(expense.id)}>
                        <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(expense.id)}>
                        <Trash className="mr-2 h-4 w-4" aria-hidden="true" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isEditing && (
        <ExpenseForm
          expenseId={selectedExpense || undefined}
          onClose={() => {
            setIsEditing(false)
            setSelectedExpense(null)
          }}
        />
      )}

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent aria-labelledby="alert-title" aria-describedby="alert-description">
          <AlertDialogHeader>
            <AlertDialogTitle id="alert-title">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription id="alert-description">
              This action cannot be undone. This will permanently delete the expense.
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

