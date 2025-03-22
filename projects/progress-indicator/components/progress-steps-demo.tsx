"use client"

import { useState } from "react"
import ProgressSteps, { type Step } from "./progress-steps"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Check } from "lucide-react"

export default function ProgressStepsDemo() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [currentStepId, setCurrentStepId] = useState(1)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const { toast } = useToast()

  // Reset handler to restart the process
  const handleReset = () => {
    setShowResetDialog(false)
    setShowSuccess(false)
    setCurrentStepId(1)

    toast({
      title: "Progress reset",
      description: "Your progress has been reset to the beginning.",
      action: (
        <Button variant="outline" size="sm" onClick={() => setShowSuccess(true)}>
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

  // Success screen with Start Again button
  if (showSuccess) {
    return (
      <>
        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="pt-6 px-4 sm:px-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Process Completed!</h2>
            <p className="text-muted-foreground text-center mb-6">You have successfully completed all the steps.</p>

            <Button onClick={() => setShowResetDialog(true)}>Start Again</Button>
          </CardContent>
        </Card>

        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent className="bg-[#0a0f1a] border-[#1a2030] w-[calc(100%-2rem)] max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">Reset Progress?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-base">
                This will reset all your progress. Are you sure you want to start over?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel
                className="bg-transparent border-[#1a2030] hover:bg-[#1a2030] hover:text-white"
                onClick={() => setShowResetDialog(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction className="bg-white text-black hover:bg-gray-200" onClick={handleReset}>
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return <ProgressSteps steps={steps} initialStep={currentStepId} onComplete={handleComplete} />
}

