import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PackageIcon } from "lucide-react"
import { InventoryAlert } from "@/types"

interface InventoryAlertsProps {
  alerts: InventoryAlert[]
  className?: string
}

export function InventoryAlerts({ alerts, className }: InventoryAlertsProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Inventory Alerts</CardTitle>
          <CardDescription>Products that need attention</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center space-y-2 text-center">
              <PackageIcon className="h-10 w-10 text-muted-foreground" />
              <div className="text-lg font-medium">No inventory alerts</div>
              <div className="text-sm text-muted-foreground">All products are in stock.</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-4">
                <div>
                  <Badge
                    variant={alert.status === "out_of_stock" ? "destructive" : "outline"}
                    className={alert.status === "out_of_stock" ? "" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"}
                  >
                    {alert.status === "out_of_stock" ? "Out of Stock" : "Low Stock"}
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{alert.productName}</div>
                  <div className="text-sm text-muted-foreground">
                    Current stock: {alert.currentStock}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Reorder
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
