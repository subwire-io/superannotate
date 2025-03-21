"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"

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

  // Update parent component when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as PaymentFormValues)
    })
    return () => subscription.unsubscribe()
  }, [form, updateFormData])

  function onSubmit(data: PaymentFormValues) {
    updateFormData(data)
    onNext()
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  // Restrict CVV to numbers only
  const formatCVV = (value: string) => {
    return value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
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
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  inputMode="numeric"
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="transition-colors focus:border-primary hover:border-input/80"
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value)
                    e.target.value = formatted
                    onChange(e)
                  }}
                  maxLength={19}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric"
                    placeholder="MM/YY"
                    className="transition-colors focus:border-primary hover:border-input/80"
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value)
                      e.target.value = formatted
                      onChange(e)
                    }}
                    maxLength={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvv"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric"
                    placeholder="123"
                    className="transition-colors focus:border-primary hover:border-input/80"
                    onChange={(e) => {
                      const formatted = formatCVV(e.target.value)
                      e.target.value = formatted
                      onChange(e)
                    }}
                    maxLength={4}
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

