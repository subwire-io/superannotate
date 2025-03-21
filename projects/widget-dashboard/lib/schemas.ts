import * as z from "zod"

export const messageFormSchema = z.object({
  recipient: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    initials: z.string(),
    avatar: z.string().optional(),
  }),
  subject: z.string().min(1, { message: "Subject is required" }),
  content: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

export const documentFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
})

export const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  department: z.string().min(1, { message: "Department is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  bio: z.string(),
})

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

