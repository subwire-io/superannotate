import { StatCard } from '@/components/dashboard/stat-card'
import { RecentOrders } from '@/components/dashboard/recent-orders'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { TopProducts } from '@/components/dashboard/top-products'
import { SalesByCategory } from '@/components/dashboard/sales-by-category'
import { InventoryAlerts } from '@/components/dashboard/inventory-alerts'
import {
  Activity,
  CreditCard,
  DollarSign,
  Package,
  ShoppingBag,
  Users
} from 'lucide-react'
import { mockOrders, mockProducts, mockSalesData, mockCategorySales, mockInventoryAlerts, mockSalesMetrics } from '@/data/mock-data'
import { formatCurrency, getPercentageChange } from '@/lib/utils'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(mockSalesMetrics.totalRevenue)}
          icon={<DollarSign className="h-4 w-4" />}
          change={getPercentageChange(mockSalesMetrics.totalRevenue, mockSalesMetrics.previousRevenue)}
          trend="up"
          description="vs. previous period"
        />
        <StatCard
          title="Orders"
          value={mockSalesMetrics.totalOrders.toString()}
          icon={<ShoppingBag className="h-4 w-4" />}
          change={getPercentageChange(mockSalesMetrics.totalOrders, mockSalesMetrics.previousOrders)}
          trend="up"
          description="vs. previous period"
        />
        <StatCard
          title="Average Order Value"
          value={formatCurrency(mockSalesMetrics.averageOrderValue)}
          icon={<CreditCard className="h-4 w-4" />}
          change={getPercentageChange(mockSalesMetrics.averageOrderValue, mockSalesMetrics.previousAverageOrderValue)}
          trend="up"
          description="vs. previous period"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RevenueChart data={mockSalesData} />
        <div className="grid gap-4">
          <StatCard
            title="Conversion Rate"
            value={`${mockSalesMetrics.conversionRate}%`}
            icon={<Activity className="h-4 w-4" />}
            change={`${(mockSalesMetrics.conversionRate - mockSalesMetrics.previousConversionRate).toFixed(1)}%`}
            trend="up"
            description="vs. previous period"
          />
          <StatCard
            title="Active Customers"
            value="720"
            icon={<Users className="h-4 w-4" />}
            change="+5.1%"
            trend="up"
            description="vs. previous period"
          />
          <StatCard
            title="Low Stock Products"
            value={mockInventoryAlerts.length.toString()}
            icon={<Package className="h-4 w-4" />}
            description="Need attention"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SalesByCategory data={mockCategorySales} className="lg:col-span-3" />
        <TopProducts products={mockProducts} className="lg:col-span-2" />
        <InventoryAlerts alerts={mockInventoryAlerts} className="lg:col-span-2" />
      </div>

      <RecentOrders orders={mockOrders} />
    </div>
  )
}
