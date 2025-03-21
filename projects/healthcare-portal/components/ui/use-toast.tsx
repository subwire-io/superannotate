import { useToast } from "@/hooks/use-toast"

export { ToastAction } from "@/components/ui/toast"

export function Toast() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(({ id, title, description, action, ...props }) => (
        <div key={id} className="bg-background border rounded-md shadow-lg p-4 mb-2 flex items-start gap-3">
          <div className="flex-1">
            {title && <div className="font-medium">{title}</div>}
            {description && <div className="text-sm text-muted-foreground">{description}</div>}
          </div>
          {action}
        </div>
      ))}
    </div>
  )
}

