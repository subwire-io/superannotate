import { CheckCircle2 } from "lucide-react"

interface Step {
  id: string
  title: string
}

interface CheckoutStepsProps {
  steps: Step[]
  currentStep: number
}

export function CheckoutSteps({ steps, currentStep }: CheckoutStepsProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`
              flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-colors
              ${
                index <= currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted bg-background text-muted-foreground"
              }
            `}
            >
              {index < currentStep ? (
                <CheckCircle2 className="h-4 w-4 md:h-6 md:w-6" />
              ) : (
                <span className="text-xs md:text-sm">{index + 1}</span>
              )}
            </div>
            <span
              className={`
              mt-2 text-xs md:text-sm font-medium
              ${index <= currentStep ? "text-primary" : "text-muted-foreground"}
            `}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-1">
        <div className="absolute inset-x-0 top-4 md:top-5 h-0.5 bg-muted"></div>
      </div>
    </div>
  )
}

