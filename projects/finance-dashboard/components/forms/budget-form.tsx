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
      allocated: 0,
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
        })
      }

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your budget.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
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
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
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
                  <FormLabel>Period</FormLabel>
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
                    <Input placeholder="Budget notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

