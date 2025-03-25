import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"

export default function NewOrderLoading() {
  return (
    <div className="flex flex-col gap-4 px-2 sm:px-4 md:px-0">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Order</h1>
          <p className="text-muted-foreground">Create a new order for your customers</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>Select items to add to the order</CardDescription>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Skeleton className="w-full sm:w-[180px] h-10" />
                <Skeleton className="flex-1 h-10" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="flex h-24">
                      <Skeleton className="w-24 h-24" />
                      <div className="flex-1 p-3">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Order #------</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />

              <div className="border rounded-lg">
                <div className="p-3 font-medium border-b">Order Items (0)</div>
                <div className="p-3 text-center text-muted-foreground">
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4 border-t pt-6">
              <div className="flex justify-between font-bold text-lg">
                <div>Total</div>
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

