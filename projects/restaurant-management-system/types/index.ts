// Common types used throughout the application

export type UserRole = "admin" | "manager" | "waiter" | "chef"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface Table {
  id: string
  number: number
  capacity: number
  status: "available" | "occupied" | "reserved" | "cleaning"
  locationDescription?: string
}

export interface Reservation {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  partySize: number
  tableId: string
  status: "confirmed" | "pending" | "cancelled" | "completed"
  notes?: string
  createdAt: string
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  categoryId: string
  available: boolean
  popular?: boolean
  allergens?: string[]
  nutritionalInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
}

export interface OrderItem {
  id: string
  menuItemId: string
  menuItemName: string
  quantity: number
  price: number
  specialInstructions?: string
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
}

export interface Order {
  id: string
  tableId: string
  tableNumber: number
  serverName: string
  items: OrderItem[]
  status: "active" | "completed" | "cancelled"
  specialInstructions?: string
  createdAt: string
  updatedAt: string
  total: number
}

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  popularItems: {
    itemName: string
    count: number
  }[]
  occupancyRate: number
  reservationsToday: number
}

