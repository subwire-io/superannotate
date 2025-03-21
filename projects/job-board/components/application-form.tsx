"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter, DialogClose } from "@/components/ui/dialog"
import type { Job } from "@/lib/types"

interface ApplicationFormProps {
  job: Job
}

export function ApplicationForm({ job }: ApplicationFormProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null as File | null,
    coverLetter: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormState((prev) => ({
        ...prev,
        resume: e.target.files![0],
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      console.log("Application submitted:", {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        ...formState,
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
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" required value={formState.name} onChange={handleInputChange} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required value={formState.email} onChange={handleInputChange} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" value={formState.phone} onChange={handleInputChange} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="resume">Resume/CV</Label>
          <Input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" required onChange={handleFileChange} />
          <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="coverLetter">Cover Letter</Label>
          <Textarea
            id="coverLetter"
            name="coverLetter"
            rows={5}
            placeholder="Tell us why you're interested in this position..."
            value={formState.coverLetter}
            onChange={handleInputChange}
          />
        </div>
      </div>

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
  )
}

