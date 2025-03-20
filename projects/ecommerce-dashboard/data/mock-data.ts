import { 
  Product, 
  Customer, 
  Order, 
  SalesData, 
  CategorySales, 
  RegionalSales, 
  SalesMetrics, 
  InventoryAlert,
  CustomerMetrics
} from '@/types'

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 249.99,
    stock: 32,
    category: 'Electronics',
    imageUrl: '/placeholder.svg?height=80&width=80',
    createdAt: '2023-06-15T10:30:00Z',
    sales: 125
  },
  {
    id: 'prod-2',
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitoring and sleep tracking',
    price: 199.99,
    stock: 18,
    category: 'Electronics',
    imageUrl: '/placeholder.svg?height=80&width=80',
    createdAt: '2023-07-02T14:45:00Z',
    sales: 87
  },
  {
    id: 'prod-3',
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and eco-friendly cotton t-shirt',
    price: 29.99,
    stock: 150,
    category: 'Clothing',
    imageUrl: '/placeholder.svg?height=80&width=80',
    createdAt: '2023-05-20T09:15:00Z',
    sales: 210
  },
  {
    id: 'prod-4',
    name: 'Smartphone Stand',
    description: 'Adjustable aluminum stand for smartphones and tablets',
    price: 24.99,
    stock: 5,
    category: 'Accessories',
    imageUrl: '/placeholder.svg?height=80&width=80',
    createdAt: '2023-08-10T16:20:00Z',
    sales: 95
  },
  {
    id: 'prod-5',
    name: 'Leather Wallet',
    description: 'Handcrafted genuine leather wallet with RFID protection',
    price: 49.99,
    stock: 42,
    category: 'Accessories',
    imageUrl: '/placeholder.svg?height=80&width=80',
    createdAt: '2023-04-05T11:30:00Z',
    sales: 63
  },
  {
    id: 'prod-6',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof Bluetooth speaker with 24-hour battery life',
    price: 79.99,
    stock: 0,
    category: 'Electronics',
    imageUrl: '/placeholder.svg?height=80&width=80',
    createdAt: '2023-05-18T13:10:00Z',
    sales: 142
  },
  {
    id: 'prod-7',
    name: 'Stainless Steel Water Bottle',
    description: 'Vacuum insulated bottle that keeps drinks cold for 24 hours',
    price: 34.99,
    stock: 67,
    category: 'Home & Kitchen',
    imageUrl: '/placeholder.svg?height=80&width=80',
    createdAt: '2023-07-22T10:45:00Z',
    sales: 189
  },
  {
    id: 'prod-8',
    name: 'Ergonomic Office Chair',
    description: 'Adjustable chair with lumbar support and breathable mesh',
    price: 249.99,
    stock: 12,
    category: 'Furniture',
    imageUrl: '/placeholder.svg?height=80&width=80',
    createdAt: '2023-06-30T09:20:00Z',
    sales: 42
  },
  {
    id: 'prod-9',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charger compatible with all Qi-enabled devices',
    price: 39.99,
    stock: 3,
    category: 'Electronics',
    imageUrl: '/placeholder.svg?height=80&width=80',
    createdAt: '2023-08-05T15:30:00Z',
    sales: 76
  },
  {
    id: 'prod-10',
    name: 'Yoga Mat',
    description: 'Non-slip exercise mat for yoga and fitness',
    price: 29.99,
    stock: 25,
    category: 'Sports & Outdoors',
    imageUrl: '/placeholder.svg?height=80&width=80',
    createdAt: '2023-07-10T08:15:00Z',
    sales: 53
  }
]

export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    location: 'New York, USA',
    totalSpent: 1243.87,
    totalOrders: 8,
    createdAt: '2023-01-15T10:30:00Z',
    lastPurchase: '2023-08-10T14:20:00Z',
    status: 'active'
  },
  {
    id: 'cust-2',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    location: 'Los Angeles, USA',
    totalSpent: 876.50,
    totalOrders: 5,
    createdAt: '2023-02-20T09:15:00Z',
    lastPurchase: '2023-07-25T16:45:00Z',
    status: 'active'
  },
  {
    id: 'cust-3',
    name: 'Sophia Garcia',
    email: 'sophia.garcia@example.com',
    location: 'Chicago, USA',
    totalSpent: 2154.30,
    totalOrders: 12,
    createdAt: '2022-11-05T14:40:00Z',
    lastPurchase: '2023-08-12T11:30:00Z',
    status: 'active'
  },
  {
    id: 'cust-4',
    name: 'William Lee',
    email: 'william.lee@example.com',
    location: 'Toronto, Canada',
    totalSpent: 432.75,
    totalOrders: 3,
    createdAt: '2023-04-18T16:20:00Z',
    lastPurchase: '2023-07-30T09:10:00Z',
    status: 'active'
  },
  {
    id: 'cust-5',
    name: 'Olivia Wilson',
    email: 'olivia.wilson@example.com',
    location: 'London, UK',
    totalSpent: 1765.92,
    totalOrders: 9,
    createdAt: '2022-12-10T08:50:00Z',
    lastPurchase: '2023-06-15T13:25:00Z',
    status: 'inactive'
  },
  {
    id: 'cust-6',
    name: 'James Martinez',
    email: 'james.martinez@example.com',
    location: 'Miami, USA',
    totalSpent: 965.40,
    totalOrders: 6,
    createdAt: '2023-03-25T11:10:00Z',
    lastPurchase: '2023-08-05T15:40:00Z',
    status: 'active'
  },
  {
    id: 'cust-7',
    name: 'Ava Anderson',
    email: 'ava.anderson@example.com',
    location: 'Sydney, Australia',
    totalSpent: 324.80,
    totalOrders: 2,
    createdAt: '2023-05-30T12:35:00Z',
    lastPurchase: '2023-07-20T10:15:00Z',
    status: 'active'
  },
  {
    id: 'cust-8',
    name: 'Alexander Thomas',
    email: 'alexander.thomas@example.com',
    location: 'Berlin, Germany',
    totalSpent: 1543.65,
    totalOrders: 7,
    createdAt: '2023-01-05T09:40:00Z',
    lastPurchase: '2023-06-28T14:50:00Z',
    status: 'inactive'
  }
]

export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    customerId: 'cust-3',
    customerName: 'Sophia Garcia',
    amount: 329.98,
    status: 'completed',
    date: '2023-08-12T11:30:00Z',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Wireless Headphones',
        quantity: 1,
        price: 249.99
      },
      {
        id: 'item-2',
        productId: 'prod-9',
        productName: 'Wireless Charging Pad',
        quantity: 2,
        price: 39.99
      }
    ],
    paymentMethod: 'Credit Card',
    shippingAddress: '123 Main St, Chicago, IL'
  },
  {
    id: 'ord-2',
    customerId: 'cust-1',
    customerName: 'Emma Johnson',
    amount: 199.99,
    status: 'shipped',
    date: '2023-08-10T14:20:00Z',
    items: [
      {
        id: 'item-3',
        productId: 'prod-2',
        productName: 'Smart Watch',
        quantity: 1,
        price: 199.99
      }
    ],
    paymentMethod: 'PayPal',
    shippingAddress: '456 Oak Ave, New York, NY'
  },
  {
    id: 'ord-3',
    customerId: 'cust-6',
    customerName: 'James Martinez',
    amount: 114.97,
    status: 'processing',
    date: '2023-08-05T15:40:00Z',
    items: [
      {
        id: 'item-4',
        productId: 'prod-4',
        productName: 'Smartphone Stand',
        quantity: 1,
        price: 24.99
      },
      {
        id: 'item-5',
        productId: 'prod-3',
        productName: 'Organic Cotton T-Shirt',
        quantity: 3,
        price: 29.99
      }
    ],
    paymentMethod: 'Credit Card',
    shippingAddress: '789 Palm Blvd, Miami, FL'
  },
  {
    id: 'ord-4',
    customerId: 'cust-4',
    customerName: 'William Lee',
    amount: 249.99,
    status: 'pending',
    date: '2023-07-30T09:10:00Z',
    items: [
      {
        id: 'item-6',
        productId: 'prod-8',
        productName: 'Ergonomic Office Chair',
        quantity: 1,
        price: 249.99
      }
    ],
    paymentMethod: 'Credit Card',
    shippingAddress: '101 Maple Dr, Toronto, ON'
  },
  {
    id: 'ord-5',
    customerId: 'cust-7',
    customerName: 'Ava Anderson',
    amount: 254.95,
    status: 'completed',
    date: '2023-07-20T10:15:00Z',
    items: [
      {
        id: 'item-7',
        productId: 'prod-7',
        productName: 'Stainless Steel Water Bottle',
        quantity: 1,
        price: 34.99
      },
      {
        id: 'item-8',
        productId: 'prod-6',
        productName: 'Portable Bluetooth Speaker',
        quantity: 1,
        price: 79.99
      },
      {
        id: 'item-9',
        productId: 'prod-5',
        productName: 'Leather Wallet',
        quantity: 2,
        price: 49.99
      },
      {
        id: 'item-10',
        productId: 'prod-10',
        productName: 'Yoga Mat',
        quantity: 1,
        price: 29.99
      }
    ],
    paymentMethod: 'PayPal',
    shippingAddress: '202 Beach Rd, Sydney, NSW'
  },
  {
    id: 'ord-6',
    customerId: 'cust-2',
    customerName: 'Michael Brown',
    amount: 329.98,
    status: 'cancelled',
    date: '2023-07-15T13:45:00Z',
    items: [
      {
        id: 'item-11',
        productId: 'prod-1',
        productName: 'Wireless Headphones',
        quantity: 1,
        price: 249.99
      },
      {
        id: 'item-12',
        productId: 'prod-4',
        productName: 'Smartphone Stand',
        quantity: 1,
        price: 24.99
      },
      {
        id: 'item-13',
        productId: 'prod-9',
        productName: 'Wireless Charging Pad',
        quantity: 1,
        price: 39.99
      }
    ],
    paymentMethod: 'Credit Card',
    shippingAddress: '303 Sunset Blvd, Los Angeles, CA'
  }
]

export const mockSalesData: SalesData[] = [
  { date: '2023-07-01', revenue: 2450.75, orders: 18 },
  { date: '2023-07-02', revenue: 1890.30, orders: 14 },
  { date: '2023-07-03', revenue: 2100.50, orders: 16 },
  { date: '2023-07-04', revenue: 3200.25, orders: 22 },
  { date: '2023-07-05', revenue: 2800.60, orders: 19 },
  { date: '2023-07-06', revenue: 1950.40, orders: 15 },
  { date: '2023-07-07', revenue: 2300.80, orders: 17 },
  { date: '2023-07-08', revenue: 2650.35, orders: 20 },
  { date: '2023-07-09', revenue: 1800.90, orders: 13 },
  { date: '2023-07-10', revenue: 2400.45, orders: 18 },
  { date: '2023-07-11', revenue: 2750.70, orders: 21 },
  { date: '2023-07-12', revenue: 2200.55, orders: 16 },
  { date: '2023-07-13', revenue: 1950.20, orders: 14 },
  { date: '2023-07-14', revenue: 2350.65, orders: 17 },
  { date: '2023-07-15', revenue: 2850.30, orders: 22 },
  { date: '2023-07-16', revenue: 3100.75, orders: 24 },
  { date: '2023-07-17', revenue: 2600.40, orders: 19 },
  { date: '2023-07-18', revenue: 2150.85, orders: 16 },
  { date: '2023-07-19', revenue: 2350.50, orders: 18 },
  { date: '2023-07-20', revenue: 2900.25, orders: 21 },
  { date: '2023-07-21', revenue: 2450.60, orders: 19 },
  { date: '2023-07-22', revenue: 2700.35, orders: 20 },
  { date: '2023-07-23', revenue: 2250.90, orders: 17 },
  { date: '2023-07-24', revenue: 2500.15, orders: 18 },
  { date: '2023-07-25', revenue: 2950.70, orders: 22 },
  { date: '2023-07-26', revenue: 2400.25, orders: 18 },
  { date: '2023-07-27', revenue: 2200.80, orders: 16 },
  { date: '2023-07-28', revenue: 2600.45, orders: 20 },
  { date: '2023-07-29', revenue: 3000.10, orders: 23 },
  { date: '2023-07-30', revenue: 2550.65, orders: 19 },
  { date: '2023-07-31', revenue: 2800.30, orders: 21 }
]

export const mockCategorySales: CategorySales[] = [
  { category: 'Electronics', sales: 25420, percentage: 42 },
  { category: 'Clothing', sales: 12500, percentage: 21 },
  { category: 'Accessories', sales: 9800, percentage: 16 },
  { category: 'Home & Kitchen', sales: 7300, percentage: 12 },
  { category: 'Sports & Outdoors', sales: 3400, percentage: 6 },
  { category: 'Furniture', sales: 1800, percentage: 3 }
]

export const mockRegionalSales: RegionalSales[] = [
  { region: 'North America', sales: 35200, percentage: 58 },
  { region: 'Europe', sales: 12400, percentage: 21 },
  { region: 'Asia', sales: 7600, percentage: 13 },
  { region: 'Australia', sales: 3200, percentage: 5 },
  { region: 'Africa', sales: 1800, percentage: 3 }
]

export const mockSalesMetrics: SalesMetrics = {
  totalRevenue: 96300.45,
  previousRevenue: 82450.30,
  totalOrders: 584,
  previousOrders: 521,
  averageOrderValue: 164.90,
  previousAverageOrderValue: 158.25,
  conversionRate: 4.2,
  previousConversionRate: 3.8
}

export const mockInventoryAlerts: InventoryAlert[] = [
  {
    id: 'alert-1',
    productId: 'prod-6',
    productName: 'Portable Bluetooth Speaker',
    currentStock: 0,
    threshold: 5,
    status: 'out_of_stock'
  },
  {
    id: 'alert-2',
    productId: 'prod-4',
    productName: 'Smartphone Stand',
    currentStock: 5,
    threshold: 10,
    status: 'low'
  },
  {
    id: 'alert-3',
    productId: 'prod-9',
    productName: 'Wireless Charging Pad',
    currentStock: 3,
    threshold: 10,
    status: 'low'
  },
  {
    id: 'alert-4',
    productId: 'prod-8',
    productName: 'Ergonomic Office Chair',
    currentStock: 12,
    threshold: 15,
    status: 'low'
  }
]

export const mockCustomerMetrics: CustomerMetrics = {
  newCustomers: 125,
  previousNewCustomers: 98,
  activeCustomers: 720,
  previousActiveCustomers: 685,
  churnRate: 2.8,
  previousChurnRate: 3.2,
  customerLifetimeValue: 540.25,
  previousCustomerLifetimeValue: 505.80
}
