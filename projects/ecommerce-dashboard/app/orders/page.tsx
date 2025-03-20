import { OrdersTable } from '@/components/orders/orders-table'
import { mockOrders } from '@/data/mock-data'

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
      <p className="text-muted-foreground">
        View and manage all customer orders.
      </p>
      
      <OrdersTable orders={mockOrders} />
    </div>
  )
}
