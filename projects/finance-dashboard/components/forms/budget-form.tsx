"use client"

import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
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
import { budgetFormSchema, type BudgetFormValues } from "@/lib/form-schemas"
import { useToast } from "@/hooks/use-toast"

interface BudgetFormProps {
  budgetId?: string
  onClose: () => void
}

export function BudgetForm({ budgetId, onClose }: BudgetFormProps) {
  const { budgets, addBudget, updateBudget } = useFinance()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: "",
      allocated: undefined,
      period: new Date(),
      notes: "",
    },
  })

  // If editing, populate form with existing budget data
  useEffect(() => {
    if (budgetId) {
      const budget = budgets.find((b) => b.id === budgetId)
      if (budget) {
        form.reset({
          category: budget.category,
          allocated: budget.allocated,
          period: new Date(),
          notes: "",
        })
      }
    }
  }, [budgetId, budgets, form])

  const onSubmit = async (data: BudgetFormValues) => {
    if (data.allocated === undefined || isNaN(data.allocated)) {
      form.setError("allocated", {
        type: "manual",
        message: "Amount is required and must be a number",
      })
      return
    }

    setIsSubmitting(true)

    try {
      if (budgetId) {
        // Update existing budget
        const budget = budgets.find((b) => b.id === budgetId)
        if (budget) {
          updateBudget({
            ...budget,
            category: data.category,
            allocated: data.allocated,
          })
        }

        toast({
          title: "Budget updated",
          description: "Your budget has been updated successfully.",
          duration: 3000,
        })
      } else {
        // Add new budget
        addBudget({
          category: data.category,
          allocated: data.allocated,
        })

        toast({
          title: "Budget created",
          description: "Your budget has been created successfully.",
          duration: 3000,
        })
      }

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your budget.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-5 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-4">
          <DialogTitle>{budgetId ? "Edit Budget" : "Create Budget"}</DialogTitle>
          <DialogDescription>
            {budgetId ? "Update your budget allocation." : "Set up a new budget for a category."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allocated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        className="pl-7"
                        placeholder="0.00"
                        {...field}
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                          field.onChange(value)
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Budget Period</FormLabel>
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
                          {field.value ? format(field.value, "MMMM yyyy") : "Select month"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-2 text-center text-sm font-medium">
                        {/* Only show month and year in header */}
                        {field.value ? format(field.value, "MMMM yyyy") : "Select month"}
                      </div>
                      <div className="p-2">
                        {/* Custom month picker that only allows selecting months */}
                        <div className="grid grid-cols-3 gap-2">
                          {Array.from({ length: 12 }, (_, i) => {
                            const date = new Date()
                            date.setMonth(i)
                            return (
                              <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                className={cn(
                                  "h-9 w-full",
                                  field.value && field.value.getMonth() === i
                                    ? "bg-primary text-primary-foreground"
                                    : "",
                                )}
                                onClick={() => {
                                  const newDate = new Date()
                                  newDate.setMonth(i)
                                  field.onChange(newDate)
                                }}
                              >
                                {format(date, "MMM")}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
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
                    <Input placeholder="Budget notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-2">
              <Button variant="outline" type="button" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

