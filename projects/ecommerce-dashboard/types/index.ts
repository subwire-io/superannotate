export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
  createdAt: string
  sales: number
}

export interface Customer {
  id: string
  name: string
  email: string
  location: string
  totalSpent: number
  totalOrders: number
  createdAt: string
  lastPurchase: string
  status: 'active' | 'inactive'
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  date: string
  items: OrderItem[]
  paymentMethod: string
  shippingAddress: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface SalesData {
  date: string
  revenue: number
  orders: number
}

export interface CategorySales {
  category: string
  sales: number
  percentage: number
}

export interface RegionalSales {
  region: string
  sales: number
  percentage: number
}

export interface SalesMetrics {
  totalRevenue: number
  previousRevenue: number
  totalOrders: number
  previousOrders: number
  averageOrderValue: number
  previousAverageOrderValue: number
  conversionRate: number
  previousConversionRate: number
}

export interface InventoryAlert {
  id: string
  productId: string
  productName: string
  currentStock: number
  threshold: number
  status: 'low' | 'out_of_stock'
}

export interface CustomerMetrics {
  newCustomers: number
  previousNewCustomers: number
  activeCustomers: number
  previousActiveCustomers: number
  churnRate: number
  previousChurnRate: number
  customerLifetimeValue: number
  previousCustomerLifetimeValue: number
}

export type TimeRange = '7d' | '30d' | '90d' | '12m' | 'all'
