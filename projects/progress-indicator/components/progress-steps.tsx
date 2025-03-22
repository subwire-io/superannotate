"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface Step {
  id: number
  title: string
  description: string
}

export interface ProgressStepsProps {
  steps: Step[]
  initialStep?: number
  onComplete?: () => void
}

export default function ProgressSteps({ steps, initialStep = 1, onComplete }: ProgressStepsProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)

  // Update current step when initialStep prop changes
  useEffect(() => {
    setCurrentStep(initialStep)
  }, [initialStep])

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else if (onComplete) {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const activeStep = steps.find((step) => step.id === currentStep) || steps[0]

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
      {/* Progress indicator */}
      <div className="relative mb-8">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-muted w-full" aria-hidden="true" />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          aria-hidden="true"
        />

        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border transition-all duration-300",
                  step.id < currentStep
                    ? "bg-primary text-primary-foreground border-primary"
                    : step.id === currentStep
                      ? "bg-background text-foreground border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "bg-background text-muted-foreground border-muted hover:border-primary/50 hover:text-foreground/80",
                )}
                aria-current={step.id === currentStep ? "step" : undefined}
              >
                {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center w-16 md:w-auto truncate",
                  step.id === currentStep ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div
        className="mb-8 p-4 sm:p-6 border rounded-lg bg-card text-card-foreground transition-all duration-300 ease-in-out step-content"
        key={activeStep.id}
      >
        <h3 className="text-lg font-semibold mb-2">{activeStep.title}</h3>
        <p className="text-muted-foreground">{activeStep.description}</p>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="transition-all duration-300"
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground self-center">
          Step {currentStep} of {steps.length}
        </div>
        <Button onClick={handleNext} className="transition-all duration-300">
          {currentStep === steps.length ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  )
}

