import { Suspense } from "react"
import NewOrderForm from "@/components/orders/new-order-form"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewOrderPage() {
  return (
    <Suspense fallback={<NewOrderSkeleton />}>
      <NewOrderForm />
    </Suspense>
  )
}

function NewOrderSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-2 sm:px-4 md:px-0">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9" />
        <div>
          <Skeleton className="h-8 w-48 mb-1" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-1 space-y-4">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
        <div className="md:col-span-1 space-y-4">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

