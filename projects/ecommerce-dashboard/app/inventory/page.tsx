import { InventoryTable } from '@/components/inventory/inventory-table'
import { mockProducts } from '@/data/mock-data'

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
      <p className="text-muted-foreground">
        Track and manage your product inventory.
      </p>
      
      <InventoryTable products={mockProducts} />
    </div>
  )
}
