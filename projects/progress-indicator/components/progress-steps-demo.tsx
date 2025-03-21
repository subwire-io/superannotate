"use client"

import type React from "react"

import { useState } from "react"
import ProgressSteps, { type Step } from "./progress-steps"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Import the AlertDialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useToast } from "@/hooks/use-toast"

// Add toast hook
export default function ProgressStepsDemo() {
  const [showSuccess, setShowSuccess] = useState(false)
  const { toast } = useToast()

  // Update the reset handler to show toast
  const handleReset = () => {
    setShowSuccess(false)
    toast({
      title: "Progress reset",
      description: "Your progress has been reset to the beginning.",
      action: (
        <Button variant="outline" size="sm" onClick={() => setShowSuccess(true)} className="hover:bg-secondary">
          Undo
        </Button>
      ),
    })
  }

  const steps: Step[] = [
    {
      id: 1,
      title: "Account",
      description: "Create your account and set up your profile information.",
    },
    {
      id: 2,
      title: "Details",
      description: "Provide additional details about your preferences and requirements.",
    },
    {
      id: 3,
      title: "Verify",
      description: "Verify your identity with the required documents and information.",
    },
    {
      id: 4,
      title: "Complete",
      description: "Review your information and complete the setup process.",
    },
  ]

  const handleComplete = () => {
    setShowSuccess(true)
  }

  // Replace the simple button with AlertDialog for confirmation
  if (showSuccess) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Process Completed!</h2>
          <p className="text-muted-foreground text-center mb-6">You have successfully completed all the steps.</p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="transition-all duration-300 hover:bg-primary/90">Start Again</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all your progress. Are you sure you want to start over?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="transition-all duration-300 hover:bg-secondary">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  className="transition-all duration-300 hover:bg-destructive/90"
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    )
  }

  return <ProgressSteps steps={steps} onComplete={handleComplete} />
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

