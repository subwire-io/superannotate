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
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`
              flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
              ${
                index <= currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted bg-background text-muted-foreground"
              }
            `}
            >
              {index < currentStep ? <CheckCircle2 className="h-6 w-6" /> : <span>{index + 1}</span>}
            </div>
            <span
              className={`
              mt-2 text-sm font-medium
              ${index <= currentStep ? "text-primary" : "text-muted-foreground"}
            `}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-1">
        <div className="absolute inset-x-0 top-5 h-0.5 bg-muted"></div>
      </div>
    </div>
  )
}

