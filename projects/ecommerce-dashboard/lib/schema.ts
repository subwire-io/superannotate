import * as z from "zod"

// Define Zod schemas for form validation
export const orderFormSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  notes: z.string().optional(),
  notifyCustomer: z.boolean().default(false),
})

export const searchFormSchema = z.object({
  query: z.string().min(3, {
    message: "Search query must be at least 3 characters.",
  }),
})

export type OrderFormValues = z.infer<typeof orderFormSchema>
export type SearchFormValues = z.infer<typeof searchFormSchema>

