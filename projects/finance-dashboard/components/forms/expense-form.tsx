"use client"

import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { useFinance } from "@/lib/data-context"
import { expenseFormSchema, type ExpenseFormValues } from "@/lib/form-schemas"
import { useToast } from "@/hooks/use-toast"

interface ExpenseFormProps {
  expenseId?: string
  onClose: () => void
}

export function ExpenseForm({ expenseId, onClose }: ExpenseFormProps) {
  const { expenses, addExpense, updateExpense } = useFinance()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: undefined,
      description: "",
      category: "",
      date: new Date(),
      notes: "",
    },
  })

  // If editing, populate form with existing expense data
  useEffect(() => {
    if (expenseId) {
      const expense = expenses.find((e) => e.id === expenseId)
      if (expense) {
        form.reset({
          amount: expense.amount,
          description: expense.description,
          category: expense.category,
          date: new Date(expense.date),
          notes: "",
        })
      }
    }
  }, [expenseId, expenses, form])

  const onSubmit = async (data: ExpenseFormValues) => {
    if (data.amount === undefined || isNaN(data.amount)) {
      form.setError("amount", {
        type: "manual",
        message: "Amount is required and must be a number",
      })
      return
    }

    setIsSubmitting(true)

    try {
      if (expenseId) {
        // Update existing expense
        updateExpense({
          id: expenseId,
          date: data.date.toISOString().split("T")[0],
          description: data.description,
          category: data.category,
          amount: data.amount,
        })

        toast({
          title: "Expense updated",
          description: "Your expense has been updated successfully.",
          duration: 3000,
        })
      } else {
        // Add new expense
        addExpense({
          date: data.date.toISOString().split("T")[0],
          description: data.description,
          category: data.category,
          amount: data.amount,
        })

        toast({
          title: "Expense added",
          description: "Your expense has been added successfully.",
          duration: 3000,
        })
      }

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your expense.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md w-full p-5 sm:p-6 overflow-y-auto max-h-[90vh]"
        aria-labelledby="expense-form-title"
        aria-describedby="expense-form-description"
      >
        <DialogHeader className="mb-4">
          <DialogTitle id="expense-form-title">{expenseId ? "Edit Expense" : "Add Expense"}</DialogTitle>
          <DialogDescription id="expense-form-description">
            {expenseId ? "Update the details of your expense." : "Enter the details of your expense."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span
                        className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground"
                        aria-hidden="true"
                      >
                        $
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        className="pl-7 w-full"
                        placeholder="0.00"
                        {...field}
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                          field.onChange(value)
                        }}
                        aria-describedby={`amount-error`}
                      />
                    </div>
                  </FormControl>
                  <FormMessage id="amount-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Grocery shopping"
                      className="w-full"
                      {...field}
                      aria-describedby={`description-error`}
                    />
                  </FormControl>
                  <FormMessage id="description-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full" aria-describedby={`category-error`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Housing">Housing</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Dining Out">Dining Out</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage id="category-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          type="button"
                          aria-haspopup="dialog"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                          {field.value ? format(field.value, "PPP") : "Select date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Additional details" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                aria-label="Cancel adding expense"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-label={expenseId ? "Save expense changes" : "Add new expense"}
                aria-busy={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

