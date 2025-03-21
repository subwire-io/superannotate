"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Define validation schema
const paymentFormSchema = z.object({
  cardName: z.string().min(2, "Name must be at least 2 characters"),
  cardNumber: z
    .string()
    .min(13, "Card number must be between 13-19 digits")
    .max(19, "Card number must be between 13-19 digits")
    .regex(/^[0-9\s]+$/, "Card number must contain only digits and spaces"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z
    .string()
    .min(3, "CVV must be 3-4 digits")
    .max(4, "CVV must be 3-4 digits")
    .regex(/^[0-9]+$/, "CVV must contain only digits"),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

interface PaymentFormProps {
  formData: PaymentFormValues
  updateFormData: (data: Partial<PaymentFormValues>) => void
  onNext: () => void
}

export function PaymentForm({ formData, updateFormData, onNext }: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: formData,
    mode: "onChange",
  })

  function onSubmit(data: PaymentFormValues) {
    updateFormData(data)
    onNext()
  }

  return (
    <Form {...form}>
      <form id="payment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="cardName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name on Card</FormLabel>
              <FormControl>
                <Input {...field} className="transition-colors focus:border-primary hover:border-input/80" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="transition-colors focus:border-primary hover:border-input/80"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="MM/YY"
                    className="transition-colors focus:border-primary hover:border-input/80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="123"
                    className="transition-colors focus:border-primary hover:border-input/80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}

