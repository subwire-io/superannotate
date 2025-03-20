import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SalesAnalytics } from '@/components/reports/sales-analytics'
import { ExportReport } from '@/components/reports/export-report'
import { mockSalesData, mockCategorySales, mockRegionalSales } from '@/data/mock-data'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Sales Reports</h1>
      <p className="text-muted-foreground">
        Generate and analyze detailed sales reports.
      </p>

      <div className="grid gap-6 md:grid-cols-4">
        <SalesAnalytics 
          salesData={mockSalesData} 
          categorySales={mockCategorySales} 
          regionalSales={mockRegionalSales} 
        />
        <ExportReport />
      </div>
    </div>
  )
}
