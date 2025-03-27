import * as z from "zod"

export const expenseFormSchema = z.object({
  amount: z.number().positive("Amount must be a positive number").optional(),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.date(),
  notes: z.string().optional(),
})

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>

export const budgetFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  allocated: z.number().positive("Amount must be a positive number").optional(),
  period: z.date(),
  notes: z.string().optional(),
})

export type BudgetFormValues = z.infer<typeof budgetFormSchema>

export const investmentFormSchema = z.object({
  name: z.string().min(1, "Name/Symbol is required"),
  type: z.string().min(1, "Type is required"),
  shares: z.number().positive("Shares must be a positive number"),
  price: z.number().positive("Price must be a positive number"),
  date: z.date(),
  notes: z.string().optional(),
})

export type InvestmentFormValues = z.infer<typeof investmentFormSchema>

export const goalFormSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  type: z.string().min(1, "Type is required"),
  target: z.number().positive("Target amount must be a positive number"),
  current: z.number().min(0, "Current amount must be zero or positive"),
  deadline: z.date(),
  notes: z.string().optional(),
})

export type GoalFormValues = z.infer<typeof goalFormSchema>

export const transactionFormSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.date(),
  type: z.enum(["income", "expense"]),
  notes: z.string().optional(),
})

export type TransactionFormValues = z.infer<typeof transactionFormSchema>

