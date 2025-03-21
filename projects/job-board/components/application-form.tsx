"use client"

import type React from "react"

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

interface ApplicationFormProps {
  job: Job
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  coverLetter: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ApplicationForm({ job }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      coverLetter: "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeError(null)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const allowedTypes = [".pdf", ".doc", ".docx"]
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

      if (!allowedTypes.includes(fileExtension)) {
        setResumeError("Please upload a PDF, DOC, or DOCX file")
        return
      }

      setResumeFile(file)
    }
  }

  const onSubmit = (data: FormValues) => {
    if (!resumeFile) {
      setResumeError("Please upload your resume")
      return
    }

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
        resume: resumeFile.name,
      })

      toast({
        title: "Application Submitted",
        description: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
      })
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="py-6 text-center">
        <h3 className="text-lg font-medium mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground mb-6">
          Thank you for applying to the {job.title} position at {job.company}. We'll review your application and get
          back to you soon.
        </p>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
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

        <div className="space-y-2">
          <FormLabel htmlFor="resume">Resume/CV</FormLabel>
          <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
          {resumeError && <p className="text-sm font-medium text-destructive">{resumeError}</p>}
          <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX</p>
        </div>

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

        <DialogFooter>
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

