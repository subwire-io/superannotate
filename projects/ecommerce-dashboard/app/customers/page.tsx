import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { CustomersTable } from '@/components/customers/customers-table'
import { CustomerMetrics } from '@/components/customers/customer-metrics'
import { mockCustomers, mockCustomerMetrics } from '@/data/mock-data'

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Customer Analytics</h1>
      <p className="text-muted-foreground">
        Analyze customer data and track customer metrics.
      </p>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customer List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="customers" className="space-y-4">
          <CustomersTable customers={mockCustomers} />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <CustomerMetrics metrics={mockCustomerMetrics} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
