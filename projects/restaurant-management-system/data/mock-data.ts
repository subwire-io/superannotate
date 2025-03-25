import type { User, Table, Reservation, MenuCategory, MenuItem, Order, DashboardStats } from "@/types"

// Mock Users
export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@restaurant.com",
    role: "admin",
    avatar: "/placeholder.svg?text=AU&height=40&width=40&bg=7048E8",
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@restaurant.com",
    role: "manager",
    avatar: "/placeholder.svg?text=MU&height=40&width=40&bg=0EA5E9",
  },
  {
    id: "3",
    name: "Waiter User",
    email: "waiter@restaurant.com",
    role: "waiter",
    avatar: "/placeholder.svg?text=WU&height=40&width=40&bg=10B981",
  },
  {
    id: "4",
    name: "Chef User",
    email: "chef@restaurant.com",
    role: "chef",
    avatar: "/placeholder.svg?text=CU&height=40&width=40&bg=F59E0B",
  },
]

// Mock Tables
export const tables: Table[] = [
  { id: "1", number: 1, capacity: 2, status: "available", locationDescription: "Window" },
  { id: "2", number: 2, capacity: 2, status: "occupied", locationDescription: "Window" },
  { id: "3", number: 3, capacity: 4, status: "reserved", locationDescription: "Center" },
  { id: "4", number: 4, capacity: 4, status: "available", locationDescription: "Center" },
  { id: "5", number: 5, capacity: 6, status: "available", locationDescription: "Corner" },
  { id: "6", number: 6, capacity: 8, status: "occupied", locationDescription: "Private Room" },
  { id: "7", number: 7, capacity: 2, status: "cleaning", locationDescription: "Bar" },
  { id: "8", number: 8, capacity: 2, status: "available", locationDescription: "Bar" },
]

// Mock Reservations
export const reservations: Reservation[] = [
  {
    id: "1",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "(555) 123-4567",
    date: "2023-06-15",
    time: "18:30",
    partySize: 2,
    tableId: "1",
    status: "confirmed",
    createdAt: "2023-06-10T10:00:00Z",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "(555) 987-6543",
    date: "2023-06-15",
    time: "19:00",
    partySize: 4,
    tableId: "3",
    status: "confirmed",
    notes: "Anniversary celebration",
    createdAt: "2023-06-09T14:30:00Z",
  },
  {
    id: "3",
    customerName: "Robert Johnson",
    customerEmail: "robert@example.com",
    customerPhone: "(555) 456-7890",
    date: "2023-06-16",
    time: "20:00",
    partySize: 6,
    tableId: "5",
    status: "pending",
    createdAt: "2023-06-11T09:15:00Z",
  },
  {
    id: "4",
    customerName: "Sarah Williams",
    customerEmail: "sarah@example.com",
    customerPhone: "(555) 789-0123",
    date: "2023-06-17",
    time: "19:30",
    partySize: 2,
    tableId: "2",
    status: "confirmed",
    createdAt: "2023-06-12T16:45:00Z",
  },
  {
    id: "5",
    customerName: "Michael Brown",
    customerEmail: "michael@example.com",
    customerPhone: "(555) 234-5678",
    date: "2023-06-18",
    time: "18:00",
    partySize: 3,
    tableId: "4",
    status: "cancelled",
    notes: "Cancelled due to illness",
    createdAt: "2023-06-10T11:30:00Z",
  },
]

// Mock Menu Categories
export const menuCategories: MenuCategory[] = [
  { id: "1", name: "Appetizers", description: "Starters and small bites" },
  { id: "2", name: "Main Courses", description: "Hearty entrees and specialties" },
  { id: "3", name: "Desserts", description: "Sweet treats to finish your meal" },
  { id: "4", name: "Beverages", description: "Refreshing drinks and cocktails" },
  { id: "5", name: "Sides", description: "Accompaniments for your meal" },
]

// Mock Menu Items
export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Crispy Calamari",
    description: "Lightly fried calamari served with marinara sauce",
    price: 12.99,
    image: "/placeholder.svg?text=Calamari&height=200&width=200&bg=FF6B6B",
    categoryId: "1",
    available: true,
    popular: true,
    allergens: ["Gluten", "Shellfish"],
  },
  {
    id: "2",
    name: "Bruschetta",
    description: "Toasted baguette topped with diced tomatoes, basil, and garlic",
    price: 9.99,
    image: "/placeholder.svg?text=Bruschetta&height=200&width=200&bg=FF6B6B",
    categoryId: "1",
    available: true,
    allergens: ["Gluten"],
  },
  {
    id: "3",
    name: "Grilled Salmon",
    description: "Atlantic salmon fillet with lemon butter sauce and seasonal vegetables",
    price: 24.99,
    image: "/placeholder.svg?text=Salmon&height=200&width=200&bg=4ECDC4",
    categoryId: "2",
    available: true,
    popular: true,
    allergens: ["Fish"],
    nutritionalInfo: {
      calories: 450,
      protein: 32,
      carbs: 15,
      fat: 28,
    },
  },
  {
    id: "4",
    name: "Filet Mignon",
    description: "8oz premium cut beef tenderloin with garlic mashed potatoes",
    price: 36.99,
    image: "/placeholder.svg?text=Filet&height=200&width=200&bg=4ECDC4",
    categoryId: "2",
    available: true,
    allergens: ["None"],
    nutritionalInfo: {
      calories: 550,
      protein: 45,
      carbs: 30,
      fat: 35,
    },
  },
  {
    id: "5",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    price: 9.99,
    image: "/placeholder.svg?text=Lava+Cake&height=200&width=200&bg=FFD166",
    categoryId: "3",
    available: true,
    popular: true,
    allergens: ["Gluten", "Dairy", "Eggs"],
  },
  {
    id: "6",
    name: "Tiramisu",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
    price: 8.99,
    image: "/placeholder.svg?text=Tiramisu&height=200&width=200&bg=FFD166",
    categoryId: "3",
    available: true,
    allergens: ["Gluten", "Dairy", "Eggs"],
  },
  {
    id: "7",
    name: "Craft IPA",
    description: "Local brewery IPA with citrus and pine notes",
    price: 7.99,
    image: "/placeholder.svg?text=IPA&height=200&width=200&bg=6B5CA5",
    categoryId: "4",
    available: true,
    allergens: ["Gluten"],
  },
  {
    id: "8",
    name: "Signature Cocktail",
    description: "House special with premium vodka, elderflower, and fresh lime",
    price: 12.99,
    image: "/placeholder.svg?text=Cocktail&height=200&width=200&bg=6B5CA5",
    categoryId: "4",
    available: true,
  },
  {
    id: "9",
    name: "Truffle Fries",
    description: "Crispy french fries tossed with truffle oil and parmesan",
    price: 8.99,
    image: "/placeholder.svg?text=Fries&height=200&width=200&bg=72B01D",
    categoryId: "5",
    available: true,
    popular: true,
    allergens: ["Gluten", "Dairy"],
  },
  {
    id: "10",
    name: "Seasonal Vegetables",
    description: "Chef's selection of seasonal vegetables sautéed in olive oil",
    price: 6.99,
    image: "/placeholder.svg?text=Veggies&height=200&width=200&bg=72B01D",
    categoryId: "5",
    available: true,
    allergens: ["None"],
    nutritionalInfo: {
      calories: 120,
      protein: 4,
      carbs: 15,
      fat: 7,
    },
  },
]

// Mock Orders
export const orders: Order[] = [
  {
    id: "1",
    tableId: "2",
    tableNumber: 2,
    serverName: "Waiter User",
    items: [
      {
        id: "101",
        menuItemId: "1",
        menuItemName: "Crispy Calamari",
        quantity: 1,
        price: 12.99,
        status: "delivered",
      },
      {
        id: "102",
        menuItemId: "3",
        menuItemName: "Grilled Salmon",
        quantity: 2,
        price: 24.99,
        status: "delivered",
      },
      {
        id: "103",
        menuItemId: "7",
        menuItemName: "Craft IPA",
        quantity: 2,
        price: 7.99,
        status: "delivered",
      },
    ],
    status: "active",
    createdAt: "2023-06-15T18:30:00Z",
    updatedAt: "2023-06-15T19:15:00Z",
    total: 78.95,
  },
  {
    id: "2",
    tableId: "6",
    tableNumber: 6,
    serverName: "Waiter User",
    items: [
      {
        id: "201",
        menuItemId: "2",
        menuItemName: "Bruschetta",
        quantity: 2,
        price: 9.99,
        status: "preparing",
      },
      {
        id: "202",
        menuItemId: "4",
        menuItemName: "Filet Mignon",
        quantity: 4,
        price: 36.99,
        specialInstructions: "Two medium rare, two medium well",
        status: "pending",
      },
      {
        id: "203",
        menuItemId: "9",
        menuItemName: "Truffle Fries",
        quantity: 2,
        price: 8.99,
        status: "pending",
      },
      {
        id: "204",
        menuItemId: "8",
        menuItemName: "Signature Cocktail",
        quantity: 4,
        price: 12.99,
        status: "ready",
      },
    ],
    status: "active",
    specialInstructions: "Anniversary celebration, bring dessert with candle at the end",
    createdAt: "2023-06-15T19:00:00Z",
    updatedAt: "2023-06-15T19:10:00Z",
    total: 197.9,
  },
]

// Mock Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalRevenue: 4275.85,
  totalOrders: 45,
  averageOrderValue: 95.02,
  popularItems: [
    { itemName: "Grilled Salmon", count: 18 },
    { itemName: "Filet Mignon", count: 15 },
    { itemName: "Crispy Calamari", count: 12 },
    { itemName: "Chocolate Lava Cake", count: 10 },
  ],
  occupancyRate: 68,
  reservationsToday: 12,
}

