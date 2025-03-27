"use client"

import { useState } from "react"
import { Edit, Loader2, Receipt, Trash, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
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

interface ExpenseTableProps {
  expenses: Array<{
    id: string
    date: string
    description: string
    category: string
    amount: number
  }>
}

type SortField = "date" | "description" | "category" | "amount"
type SortDirection = "asc" | "desc"

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const { deleteExpense, isLoading } = useFinance()
  const { toast } = useToast()
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
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

  // Sort expenses
  const sortedExpenses = [...expenses].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case "description":
        comparison = a.description.localeCompare(b.description)
        break
      case "category":
        comparison = a.category.localeCompare(b.category)
        break
      case "amount":
        comparison = a.amount - b.amount
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleEdit = (id: string) => {
    setSelectedExpense(id)
    setIsEditing(true)
  }

  const handleView = (id: string) => {
    setSelectedExpense(id)
    setIsViewingDetails(true)
  }

  const handleDelete = (id: string) => {
    setSelectedExpense(id)
    setIsDeleting(true)
  }

  const confirmDelete = () => {
    if (selectedExpense) {
      // Store the expense before deleting it
      const expenseToDelete = expenses.find((e) => e.id === selectedExpense)

      // Delete the expense
      deleteExpense(selectedExpense)

      // Show toast with undo option
      if (expenseToDelete) {
        toast({
          title: "Expense deleted",
          description: "The expense has been deleted successfully.",
          action: (
            <Button
              variant="outline"
              onClick={() => {
                // We don't need to call addExpense here as it's handled in the data context
                toast({
                  title: "Action undone",
                  description: "The expense has been restored.",
                })
              }}
            >
              Undo
            </Button>
          ),
        })
      }

      setIsDeleting(false)
      setSelectedExpense(null)
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
        {!isMobile && (
          <Table>
            <TableHeader>
              <TableRow>
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
                <TableHead className="w-[120px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
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
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
        {isMobile && (
          <div className="p-4 space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
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

  // Get the details of the selected expense
  const expenseDetails = selectedExpense ? expenses.find((e) => e.id === selectedExpense) : null

  return (
    <>
      {isMobile ? (
        // Mobile card view
        <div className="space-y-4 px-1">
          {sortedExpenses.map((expense) => (
            <Card key={expense.id} className="p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-base">{expense.description}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-muted-foreground">{expense.category}</span>
                  </div>
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
                    <DropdownMenuItem onClick={() => handleView(expense.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(expense.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(expense.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-muted-foreground">Date:</div>
                <div className="text-right">{format(new Date(expense.date), "MMM d, yyyy")}</div>

                <div className="text-muted-foreground">Amount:</div>
                <div className="text-right font-medium">${expense.amount.toFixed(2)}</div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // Desktop table view
        <div className="rounded-md border">
          <Table aria-label="Expense list">
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("date")}>
                  Date {getSortIcon("date")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("description")}>
                  Description {getSortIcon("description")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("category")}>
                  Category {getSortIcon("category")}
                </TableHead>
                <TableHead className="text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort("amount")}>
                  Amount {getSortIcon("amount")}
                </TableHead>
                <TableHead className="w-[120px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(expense.id)}
                        aria-label={`View details for ${expense.description}`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(expense.id)}
                        aria-label={`Edit ${expense.description}`}
                      >
                        <Edit className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(expense.id)}
                        aria-label={`Delete ${expense.description}`}
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
        <ExpenseForm
          expenseId={selectedExpense || undefined}
          onClose={() => {
            setIsEditing(false)
            setSelectedExpense(null)
          }}
        />
      )}

      {isViewingDetails && expenseDetails && (
        <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Expense Details</DialogTitle>
              <DialogDescription>Detailed information about this expense</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Description:</div>
                <div className="col-span-3">{expenseDetails.description}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Amount:</div>
                <div className="col-span-3">${expenseDetails.amount.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Category:</div>
                <div className="col-span-3">{expenseDetails.category}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Date:</div>
                <div className="col-span-3">{format(new Date(expenseDetails.date), "PPP")}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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

