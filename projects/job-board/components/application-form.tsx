"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Job } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2 } from "lucide-react"

interface ApplicationFormProps {
  job: Job
}

// Create a schema that validates all fields at once
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  coverLetter: z.string().optional(),
  resume: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Please upload your resume",
    })
    .refine(
      (file) => {
        if (!(file instanceof File)) return false
        const validTypes = [".pdf", ".doc", ".docx"]
        const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
        return validTypes.includes(fileExtension)
      },
      { message: "Please upload a PDF, DOC, or DOCX file" },
    ),
})

type FormValues = z.infer<typeof formSchema>

export function ApplicationForm({ job }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  // Initialize the form with all fields including resume
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      coverLetter: "",
    },
    mode: "onTouched", // Validate on blur for better UX
  })

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      console.log("Application submitted:", {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        ...data,
        resume: data.resume.name,
      })

      toast({
        title: "Application Submitted",
        description: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
      })
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="py-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold">Application Submitted!</h3>
          <p className="text-muted-foreground max-w-md">
            Thank you for applying to the {job.title} position at {job.company}. We'll review your application and get
            back to you soon.
          </p>
          <DialogClose asChild>
            <Button className="mt-4">Close</Button>
          </DialogClose>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Resume/CV</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      onChange(file)
                    }
                  }}
                  {...fieldProps}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Tell us why you're interested in this position..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

