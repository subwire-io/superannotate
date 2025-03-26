// Sample data for charts and tables
export const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 },
]

export const salesData = [
  { name: "Jan", sales: 400 },
  { name: "Feb", sales: 300 },
  { name: "Mar", sales: 500 },
  { name: "Apr", sales: 450 },
  { name: "May", sales: 600 },
  { name: "Jun", sales: 550 },
  { name: "Jul", sales: 700 },
]

export const categoryData = [
  { name: "Electronics", value: 400 },
  { name: "Clothing", value: 300 },
  { name: "Home & Kitchen", value: 200 },
  { name: "Books", value: 150 },
  { name: "Beauty", value: 100 },
]

export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export const initialOrders = [
  { id: "ORD-001", customer: "John Doe", date: "2023-07-01", status: "Delivered", total: "$120.00" },
  { id: "ORD-002", customer: "Jane Smith", date: "2023-07-02", status: "Processing", total: "$85.50" },
  { id: "ORD-003", customer: "Bob Johnson", date: "2023-07-03", status: "Shipped", total: "$210.75" },
  { id: "ORD-004", customer: "Alice Brown", date: "2023-07-04", status: "Pending", total: "$45.99" },
  { id: "ORD-005", customer: "Charlie Wilson", date: "2023-07-05", status: "Delivered", total: "$150.25" },
  { id: "ORD-006", customer: "Eva Martinez", date: "2023-07-06", status: "Processing", total: "$95.75" },
  { id: "ORD-007", customer: "David Lee", date: "2023-07-07", status: "Shipped", total: "$180.50" },
  { id: "ORD-008", customer: "Grace Taylor", date: "2023-07-08", status: "Pending", total: "$65.25" },
  { id: "ORD-009", customer: "Frank Robinson", date: "2023-07-09", status: "Delivered", total: "$130.00" },
  { id: "ORD-010", customer: "Helen Garcia", date: "2023-07-10", status: "Processing", total: "$110.50" },
  { id: "ORD-011", customer: "Ivan Petrov", date: "2023-07-11", status: "Pending", total: "$95.00" },
  { id: "ORD-012", customer: "Julia Kim", date: "2023-07-12", status: "Shipped", total: "$145.75" },
  { id: "ORD-013", customer: "Kevin Wong", date: "2023-07-13", status: "Delivered", total: "$210.25" },
  { id: "ORD-014", customer: "Laura Chen", date: "2023-07-14", status: "Processing", total: "$75.50" },
  { id: "ORD-015", customer: "Michael Davis", date: "2023-07-15", status: "Pending", total: "$120.00" },
]

export const initialLowStockItems = [
  { id: "PRD-001", name: "Wireless Earbuds", stock: 5, threshold: 10 },
  { id: "PRD-002", name: "Smart Watch", stock: 3, threshold: 8 },
  { id: "PRD-003", name: "Bluetooth Speaker", stock: 2, threshold: 5 },
  { id: "PRD-004", name: "Phone Case", stock: 7, threshold: 15 },
  { id: "PRD-005", name: "USB-C Cable", stock: 4, threshold: 10 },
  { id: "PRD-006", name: "Wireless Charger", stock: 6, threshold: 12 },
  { id: "PRD-007", name: "Laptop Stand", stock: 3, threshold: 7 },
  { id: "PRD-008", name: "Keyboard", stock: 5, threshold: 10 },
  { id: "PRD-009", name: "Mouse", stock: 4, threshold: 8 },
  { id: "PRD-010", name: "Headphones", stock: 2, threshold: 6 },
  { id: "PRD-011", name: "Tablet", stock: 3, threshold: 7 },
  { id: "PRD-012", name: "Power Bank", stock: 4, threshold: 9 },
  { id: "PRD-013", name: "HDMI Cable", stock: 6, threshold: 12 },
  { id: "PRD-014", name: "Webcam", stock: 2, threshold: 5 },
  { id: "PRD-015", name: "External SSD", stock: 3, threshold: 8 },
]

export const initialTopCustomers = [
  { id: "CUS-001", name: "John Doe", orders: 12, spent: "$1,250.00" },
  { id: "CUS-002", name: "Jane Smith", orders: 8, spent: "$950.75" },
  { id: "CUS-003", name: "Bob Johnson", orders: 15, spent: "$1,875.50" },
  { id: "CUS-004", name: "Alice Brown", orders: 6, spent: "$720.25" },
  { id: "CUS-005", name: "Charlie Wilson", orders: 10, spent: "$1,100.00" },
  { id: "CUS-006", name: "Eva Martinez", orders: 9, spent: "$1,050.50" },
  { id: "CUS-007", name: "David Lee", orders: 14, spent: "$1,750.25" },
  { id: "CUS-008", name: "Grace Taylor", orders: 7, spent: "$850.75" },
  { id: "CUS-009", name: "Frank Robinson", orders: 11, spent: "$1,300.00" },
  { id: "CUS-010", name: "Helen Garcia", orders: 5, spent: "$650.50" },
  { id: "CUS-011", name: "Ivan Petrov", orders: 8, spent: "$920.00" },
  { id: "CUS-012", name: "Julia Kim", orders: 13, spent: "$1,450.75" },
  { id: "CUS-013", name: "Kevin Wong", orders: 9, spent: "$1,100.25" },
  { id: "CUS-014", name: "Laura Chen", orders: 6, spent: "$780.50" },
  { id: "CUS-015", name: "Michael Davis", orders: 10, spent: "$1,200.00" },
]

