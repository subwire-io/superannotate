"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import { submitFeedback } from "@/app/actions"
import { CheckCircle2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define the form schema with validation
const formSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  comment: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      await submitFeedback(data)
      setIsSubmitted(true)
      form.reset()
    } catch (err) {
      form.setError("root", {
        message: "Failed to submit feedback. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full transition-all duration-300 hover:shadow-lg">
        <CardContent className="pt-6 flex flex-col items-center justify-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 animate-in fade-in-50 duration-300" />
          <h2 className="text-xl font-semibold text-center">Thank You!</h2>
          <p className="text-center text-muted-foreground">Your feedback has been submitted successfully.</p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="mt-4 transition-all duration-200 hover:bg-primary/10 hover:scale-105"
          >
            Submit Another Response
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-center">Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>
                    How would you rate your experience?
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <StarRating rating={field.value} onRatingChange={(value) => field.onChange(value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="comment">Additional comments</FormLabel>
                  <FormControl>
                    <Textarea
                      id="comment"
                      placeholder="Tell us more about your experience..."
                      className="resize-none transition-all duration-200 focus:border-primary"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.root.message}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

