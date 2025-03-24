import * as React from "react"
import { cn } from "@/lib/utils"

export interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const SimpleCommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(({ className, ...props }, ref) => {
  return (
    <div className="flex items-center border-b px-3">
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  )
})
SimpleCommandInput.displayName = "SimpleCommandInput"

export { SimpleCommandInput }

