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
import { investmentFormSchema, type InvestmentFormValues } from "@/lib/form-schemas"
import { useToast } from "@/hooks/use-toast"

interface InvestmentFormProps {
  investmentId?: string
  onClose: () => void
}

export function InvestmentForm({ investmentId, onClose }: InvestmentFormProps) {
  const { investments, addInvestment, updateInvestment } = useFinance()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: {
      name: "",
      type: "",
      shares: 0,
      price: 0,
      date: new Date(),
      notes: "",
    },
  })

  // If editing, populate form with existing investment data
  useEffect(() => {
    if (investmentId) {
      const investment = investments.find((i) => i.id === investmentId)
      if (investment) {
        form.reset({
          name: investment.name,
          type: investment.type,
          shares: investment.shares,
          price: investment.price,
          date: new Date(),
          notes: "",
        })
      }
    }
  }, [investmentId, investments, form])

  const onSubmit = async (data: InvestmentFormValues) => {
    setIsSubmitting(true)

    try {
      if (investmentId) {
        // Update existing investment
        const investment = investments.find((i) => i.id === investmentId)
        if (investment) {
          const value = data.shares * data.price
          updateInvestment({
            ...investment,
            name: data.name,
            type: data.type,
            shares: data.shares,
            price: data.price,
            value,
          })
        }

        toast({
          title: "Investment updated",
          description: "Your investment has been updated successfully.",
        })
      } else {
        // Add new investment
        addInvestment({
          name: data.name,
          type: data.type,
          shares: data.shares,
          price: data.price,
        })

        toast({
          title: "Investment added",
          description: "Your investment has been added successfully.",
        })
      }

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your investment.",
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
          <DialogTitle>{investmentId ? "Edit Investment" : "Add Investment"}</DialogTitle>
          <DialogDescription>
            {investmentId ? "Update the details of your investment." : "Enter the details of your investment."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name/Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="AAPL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Stock">Stock</SelectItem>
                      <SelectItem value="ETF">ETF</SelectItem>
                      <SelectItem value="Mutual Fund">Mutual Fund</SelectItem>
                      <SelectItem value="Bond">Bond</SelectItem>
                      <SelectItem value="Crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Commodity">Commodity</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shares/Units</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0001"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
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
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Purchase Date</FormLabel>
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
                    <Input placeholder="Investment notes" {...field} />
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

