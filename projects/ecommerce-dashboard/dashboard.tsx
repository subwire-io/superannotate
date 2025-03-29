"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  LineChart,
  PieChart,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  DollarSign,
  LineChartIcon,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useIsMobile } from "@/hooks/use-mobile"
import { Toaster, toast } from "sonner"

// Define Zod schemas for form validation
const orderFormSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  notes: z.string().optional(),
  notifyCustomer: z.boolean().default(false),
})

const searchFormSchema = z.object({
  query: z.string().min(3, {
    message: "Search query must be at least 3 characters.",
  }),
})

// Sample data for charts and tables
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 },
]

const salesData = [
  { name: "Jan", sales: 400 },
  { name: "Feb", sales: 300 },
  { name: "Mar", sales: 500 },
  { name: "Apr", sales: 450 },
  { name: "May", sales: 600 },
  { name: "Jun", sales: 550 },
  { name: "Jul", sales: 700 },
]

const categoryData = [
  { name: "Electronics", value: 400 },
  { name: "Clothing", value: 300 },
  { name: "Home & Kitchen", value: 200 },
  { name: "Books", value: 150 },
  { name: "Beauty", value: 100 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const initialOrders = [
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

const initialLowStockItems = [
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

const initialTopCustomers = [
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

export default function Dashboard() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState("overview")
  const [orders, setOrders] = useState(initialOrders)
  const [lowStockItems, setLowStockItems] = useState(initialLowStockItems)
  const [topCustomers, setTopCustomers] = useState(initialTopCustomers)
  const [orderSearchTerm, setOrderSearchTerm] = useState("")
  const [orderStatusFilter, setOrderStatusFilter] = useState("all")
  const [orderSort, setOrderSort] = useState("newest")
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [restockLoading, setRestockLoading] = useState({})
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [showAddOrderDialog, setShowAddOrderDialog] = useState(false)
  const [searchInputRef] = useState(useRef(null))

  // Function to handle chart element click for mobile
  const handleChartElementClick = (data, category) => {
    if (isMobile) {
      let message = ""
      let description = ""

      if (category === "revenue") {
        message = `${data.name}: $${data.revenue.toLocaleString()}`
        description = `Revenue for ${data.name}`
      } else if (category === "category") {
        message = `${data.name}: ${((data.value / categoryData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)}%`
        description = `${data.value} units sold`
      }

      toast.info(message, {
        description,
        duration: 3000,
      })
    }
  }

  // Initialize form for order status update
  const orderForm = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      status: "processing",
      notes: "",
      notifyCustomer: false,
    },
  })

  // Initialize form for global search
  const searchForm = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query: "",
    },
  })

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Reset form when selected order changes
  useEffect(() => {
    if (selectedOrder) {
      orderForm.reset({
        status: selectedOrder.status.toLowerCase(),
        notes: "",
        notifyCustomer: false,
      })
    }
  }, [selectedOrder, orderForm])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt+S to focus search
      if (e.altKey && e.key === "s") {
        e.preventDefault()
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }

      // Alt+1-5 to switch tabs
      if (e.altKey && e.key >= "1" && e.key <= "5") {
        e.preventDefault()
        const tabIndex = Number.parseInt(e.key) - 1
        const tabs = ["overview", "orders", "inventory", "customers", "sales"]
        if (tabs[tabIndex]) {
          setActiveTab(tabs[tabIndex])
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Handle global search
  const onSearchSubmit = (data) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.info(`Found results for "${data.query}"`, {
        description: "Search completed successfully",
      })
    }, 800)
  }

  // Handle order search and filtering
  useEffect(() => {
    let filteredOrders = [...initialOrders]

    // Apply search filter
    if (orderSearchTerm) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(orderSearchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (orderStatusFilter !== "all") {
      filteredOrders = filteredOrders.filter((order) => order.status.toLowerCase() === orderStatusFilter.toLowerCase())
    }

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from)
      const toDate = new Date(dateRange.to)
      toDate.setHours(23, 59, 59, 999) // Include the entire end day

      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.date)
        return orderDate >= fromDate && orderDate <= toDate
      })
    }

    // Apply sorting
    if (orderSort === "newest") {
      filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (orderSort === "oldest") {
      filteredOrders.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (orderSort === "highest") {
      filteredOrders.sort(
        (a, b) => Number.parseFloat(b.total.replace("$", "")) - Number.parseFloat(a.total.replace("$", "")),
      )
    } else if (orderSort === "lowest") {
      filteredOrders.sort(
        (a, b) => Number.parseFloat(a.total.replace("$", "")) - Number.parseFloat(b.total.replace("$", "")),
      )
    }

    setOrders(filteredOrders)
    setCurrentPage(1)
  }, [orderSearchTerm, orderStatusFilter, orderSort, dateRange])

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem)
  const currentLowStockItems = lowStockItems.slice(indexOfFirstItem, indexOfLastItem)
  const currentTopCustomers = topCustomers.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const lowStockTotalPages = Math.ceil(lowStockItems.length / itemsPerPage)
  const customersTotalPages = Math.ceil(topCustomers.length / itemsPerPage)

  // Generate pagination items
  const generatePaginationItems = (currentPage, totalPages) => {
    const items = []
    const maxVisiblePages = 5

    // Always show first page
    items.push(1)

    // Calculate range of pages to show
    const startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)

    // Adjust if we're near the beginning
    if (startPage > 2) {
      items.push("...")
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(i)
    }

    // Adjust if we're near the end
    if (endPage < totalPages - 1) {
      items.push("...")
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(totalPages)
    }

    return items
  }

  const handlePageChange = (page, setPageFunction) => {
    if (page >= 1 && page <= totalPages) {
      setPageFunction(page)
    }
  }

  // Handle adding a new order
  const handleAddOrder = () => {
    setIsLoading(true)

    // Get form values
    const customerName = document.getElementById("customer-name") as HTMLInputElement
    const orderTotal = document.getElementById("order-total") as HTMLInputElement
    const orderStatusSelect = document.getElementById("order-status") as HTMLSelectElement

    // Use default values if inputs are empty
    const name = customerName?.value || "New Customer"
    const total = orderTotal?.value ? `$${Number.parseFloat(orderTotal.value).toFixed(2)}` : "$99.99"
    const status = orderStatusSelect?.value
      ? orderStatusSelect.value.charAt(0).toUpperCase() + orderStatusSelect.value.slice(1)
      : "Pending"

    // Simulate adding a new order
    setTimeout(() => {
      const newOrderId = `ORD-${(orders.length + 1).toString().padStart(3, "0")}`
      const newOrder = {
        id: newOrderId,
        customer: name,
        date: new Date().toISOString().split("T")[0],
        status: status,
        total: total,
      }

      setOrders((prevOrders) => [newOrder, ...prevOrders])
      setIsLoading(false)
      setShowAddOrderDialog(false)

      toast.success(`New order ${newOrderId} has been created`, {
        description: "The order has been added to the system",
      })
    }, 1000)
  }

  // Handle export functionality
  const handleExport = (type) => {
    setExportLoading(true)

    // Simulate export process
    setTimeout(() => {
      setExportLoading(false)

      const fileName = `${type.toLowerCase()}_export_${new Date().toISOString().split("T")[0]}.csv`

      // Determine which data to export based on type
      let dataToExport
      switch (type.toLowerCase()) {
        case "orders":
          dataToExport = orders
          break
        case "inventory":
          dataToExport = lowStockItems
          break
        case "customers":
          dataToExport = topCustomers
          break
        default:
          dataToExport = categoryData
      }

      // Download the CSV file
      downloadCSV(dataToExport, fileName)

      toast.success(`${type} data has been exported as ${fileName}`, {
        description: "Your export is ready to download",
        duration: 5000,
      })
    }, 1000)
  }

  // Create and download a CSV file
  const downloadCSV = (data, filename) => {
    // Create CSV content based on data type
    let csvContent = "data:text/csv;charset=utf-8,"

    if (filename.includes("orders")) {
      // Headers for orders
      csvContent += "Order ID,Customer,Date,Status,Total\n"
      // Add order data
      data.forEach((order) => {
        csvContent += `${order.id},${order.customer},${order.date},${order.status},${order.total}\n`
      })
    } else if (filename.includes("inventory")) {
      // Headers for inventory
      csvContent += "Product ID,Name,Current Stock,Threshold,Status\n"
      // Add inventory data
      data.forEach((item) => {
        const status =
          item.stock === 0
            ? "Out of Stock"
            : item.stock < item.threshold / 2
              ? "Critical"
              : item.stock < item.threshold
                ? "Low Stock"
                : "In Stock"
        csvContent += `${item.id},${item.name},${item.stock},${item.threshold},${status}\n`
      })
    } else if (filename.includes("customers")) {
      // Headers for customers
      csvContent += "Customer ID,Name,Total Orders,Total Spent\n"
      // Add customer data
      data.forEach((customer) => {
        csvContent += `${customer.id},${customer.name},${customer.orders},${customer.spent}\n`
      })
    } else {
      // Generic data export (dashboard/sales)
      csvContent += "Category,Value\n"
      categoryData.forEach((item) => {
        csvContent += `${item.name},${item.value}\n`
      })
    }

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", filename)
    document.body.appendChild(link)

    // Trigger download
    link.click()
    document.body.removeChild(link)
  }

  // Handle restock functionality
  const handleRestock = (itemId) => {
    setRestockLoading((prev) => ({ ...prev, [itemId]: true }))

    // Simulate restock process
    setTimeout(() => {
      setLowStockItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? { ...item, stock: item.threshold + 5 } : item)),
      )

      setRestockLoading((prev) => ({ ...prev, [itemId]: false }))

      toast.success("Item has been restocked successfully", {
        description: "Inventory has been updated",
        duration: 3000,
      })
    }, 1000)
  }

  // Handle order cancellation
  const handleCancelOrder = () => {
    if (!orderToCancel) return

    setIsLoading(true)

    // Simulate cancellation process
    setTimeout(() => {
      const originalOrder = { ...orderToCancel }

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderToCancel.id ? { ...order, status: "Cancelled" } : order)),
      )

      setIsLoading(false)
      setOrderToCancel(null)

      toast.warning(`Order ${orderToCancel.id} has been cancelled`, {
        description: "The order status has been updated",
        action: {
          label: "Undo",
          onClick: () => {
            setOrders((prevOrders) =>
              prevOrders.map((order) => (order.id === originalOrder.id ? { ...originalOrder } : order)),
            )

            toast.success(`Order ${originalOrder.id} has been restored`, {
              description: "The order has been restored to its previous state",
            })
          },
        },
        duration: 5000,
      })
    }, 800)
  }

  // Handle order status update
  const handleUpdateOrderStatus = (data) => {
    if (!selectedOrder) return

    setIsLoading(true)

    // Simulate update process
    setTimeout(() => {
      const capitalizedStatus = data.status.charAt(0).toUpperCase() + data.status.slice(1)

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === selectedOrder.id ? { ...order, status: capitalizedStatus } : order)),
      )

      setIsLoading(false)
      setSelectedOrder(null)

      toast.success(`Order ${selectedOrder.id} status changed to ${capitalizedStatus}`, {
        description: "The order has been updated successfully",
      })

      if (data.notifyCustomer) {
        toast.info(`Email sent to ${selectedOrder.customer}`, {
          description: "Customer has been notified about their order status",
        })
      }
    }, 800)
  }

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardContent>
            </Card>
          ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render pagination component
  const renderPagination = (currentPage, totalPages, setPageFunction) => {
    const paginationItems = generatePaginationItems(currentPage, totalPages)

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1, setPageFunction)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {paginationItems.map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={`page-${item}`}
              variant={currentPage === item ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(item, setPageFunction)}
              className="w-8 h-8 p-0"
            >
              {item}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1, setPageFunction)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background max-w-full">
      {/* Main dashboard content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold tracking-tight">E-Commerce Dashboard</h1>
            {/* Mobile dropdown navigation */}
            <div className="md:hidden mt-2 mb-4">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isInitialLoading ? (
            renderSkeleton()
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <div className="flex items-center text-sm">
                      <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" aria-hidden="true" />
                      <span className="text-green-500">+20.1%</span>
                      <span className="ml-1 text-muted-foreground">from last month</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2,350</div>
                    <div className="flex items-center text-sm">
                      <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" aria-hidden="true" />
                      <span className="text-green-500">+12.2%</span>
                      <span className="ml-1 text-muted-foreground">from last month</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <div className="flex items-center text-sm">
                      <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" aria-hidden="true" />
                      <span className="text-green-500">+5.4%</span>
                      <span className="ml-1 text-muted-foreground">from last month</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <LineChartIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.2%</div>
                    <div className="flex items-center text-sm">
                      <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" aria-hidden="true" />
                      <span className="text-red-500">-0.5%</span>
                      <span className="ml-1 text-muted-foreground">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs for different sections */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <div className="border-b hidden md:block">
                  <div className="container mx-auto px-0">
                    <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
                      <TabsTrigger
                        value="overview"
                        className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="orders"
                        className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Orders
                      </TabsTrigger>
                      <TabsTrigger
                        value="inventory"
                        className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Inventory
                      </TabsTrigger>
                      <TabsTrigger
                        value="customers"
                        className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Customers
                      </TabsTrigger>
                      <TabsTrigger
                        value="sales"
                        className="rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Sales
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {/* Revenue Chart */}
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        {isMobile && (
                          <CardDescription className="text-xs text-muted-foreground">
                            Tap on points for details
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="w-full overflow-hidden">
                          <ChartContainer
                            config={{
                              revenue: {
                                label: "Revenue",
                                color: "hsl(var(--chart-1))",
                              },
                            }}
                            className="h-[300px]"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="name"
                                  tick={{ fontSize: isMobile ? 10 : 12 }}
                                  tickFormatter={(value) => (isMobile ? value.substring(0, 1) : value)}
                                />
                                <YAxis
                                  tick={{ fontSize: isMobile ? 10 : 12 }}
                                  width={isMobile ? 30 : 40}
                                  tickFormatter={(value) => (isMobile ? `${value / 1000}k` : value)}
                                />
                                <ChartTooltip
                                  content={<ChartTooltipContent />}
                                  cursor={{ strokeDasharray: "3 3" }}
                                  wrapperStyle={{ zIndex: 100 }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="revenue"
                                  stroke="var(--color-revenue)"
                                  strokeWidth={2}
                                  activeDot={{ r: 8, onClick: (e) => e.stopPropagation() }}
                                  isAnimationActive={!isMobile}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sales by Category */}
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        {isMobile && (
                          <CardDescription className="text-xs text-muted-foreground">
                            Tap on segments for details
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="w-full overflow-hidden">
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                <Pie
                                  data={categoryData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={isMobile ? 70 : 80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => {
                                    // On mobile, only show percentage
                                    if (isMobile) {
                                      return `${(percent * 100).toFixed(0)}%`
                                    }
                                    // On desktop, show name and percentage
                                    return `${name} ${(percent * 100).toFixed(0)}%`
                                  }}
                                  onClick={(data) => {
                                    if (isMobile) {
                                      toast.info(`${data.name}: ${(data.percent * 100).toFixed(0)}%`, {
                                        description: `${data.value} units sold`,
                                        duration: 3000,
                                      })
                                    }
                                  }}
                                >
                                  {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip
                                  formatter={(value) => [`${value} units`, "Sales"]}
                                  itemStyle={{ color: "var(--foreground)" }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>You have {orders.length} orders this period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {orders.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      order.status === "Delivered"
                                        ? "default"
                                        : order.status === "Processing"
                                          ? "secondary"
                                          : order.status === "Shipped"
                                            ? "outline"
                                            : order.status === "Cancelled"
                                              ? "destructive"
                                              : "warning"
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">{order.total}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="flex h-[200px] items-center justify-center">
                          <div className="flex flex-col items-center text-center">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                            <h3 className="mt-2 text-lg font-semibold">No orders found</h3>
                            <p className="text-sm text-muted-foreground">There are no orders matching your criteria.</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>{renderPagination(currentPage, totalPages, setCurrentPage)}</CardFooter>
                  </Card>
                </TabsContent>

                {/* Add the Orders tab content */}
                <TabsContent value="orders" className="space-y-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Orders</CardTitle>
                        <CardDescription>Manage and track customer orders.</CardDescription>
                      </div>
                      <Button size="sm" onClick={() => setShowAddOrderDialog(true)}>
                        Add Order
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-4">
                        <div className="flex flex-1 items-center gap-2">
                          <div className="relative flex-1 max-w-sm">
                            <input
                              type="text"
                              placeholder="Search orders..."
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={orderSearchTerm}
                              onChange={(e) => setOrderSearchTerm(e.target.value)}
                            />
                          </div>
                          <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Select value={orderSort} onValueChange={setOrderSort}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="highest">Highest Total</SelectItem>
                            <SelectItem value="lowest">Lowest Total</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {orders.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      order.status === "Delivered"
                                        ? "default"
                                        : order.status === "Processing"
                                          ? "secondary"
                                          : order.status === "Shipped"
                                            ? "outline"
                                            : order.status === "Cancelled"
                                              ? "destructive"
                                              : "warning"
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">{order.total}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                    Edit
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="flex h-[200px] items-center justify-center">
                          <div className="flex flex-col items-center text-center">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                            <h3 className="mt-2 text-lg font-semibold">No orders found</h3>
                            <p className="text-sm text-muted-foreground">There are no orders matching your criteria.</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      {renderPagination(currentPage, totalPages, setCurrentPage)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("Orders")}
                        disabled={exportLoading}
                      >
                        {exportLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>Export CSV</>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Add the Inventory tab content */}
                <TabsContent value="inventory" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inventory Management</CardTitle>
                      <CardDescription>Monitor stock levels and restock items.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Search inventory..."
                          className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      {lowStockItems.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product ID</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Current Stock</TableHead>
                              <TableHead>Threshold</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentLowStockItems.map((item) => {
                              const stockStatus =
                                item.stock === 0
                                  ? "Out of Stock"
                                  : item.stock < item.threshold / 2
                                    ? "Critical"
                                    : item.stock < item.threshold
                                      ? "Low Stock"
                                      : "In Stock"

                              return (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium">{item.id}</TableCell>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.stock}</TableCell>
                                  <TableCell>{item.threshold}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        stockStatus === "Out of Stock"
                                          ? "destructive"
                                          : stockStatus === "Critical"
                                            ? "destructive"
                                            : stockStatus === "Low Stock"
                                              ? "warning"
                                              : "default"
                                      }
                                    >
                                      {stockStatus}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRestock(item.id)}
                                      disabled={restockLoading[item.id]}
                                    >
                                      {restockLoading[item.id] ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Restocking...
                                        </>
                                      ) : (
                                        <>Restock</>
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="flex h-[200px] items-center justify-center">
                          <div className="flex flex-col items-center text-center">
                            <Package className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                            <h3 className="mt-2 text-lg font-semibold">No low stock items</h3>
                            <p className="text-sm text-muted-foreground">
                              All inventory items are at healthy stock levels.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      {renderPagination(currentPage, lowStockTotalPages, setCurrentPage)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("Inventory")}
                        disabled={exportLoading}
                      >
                        {exportLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>Export CSV</>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Add the Customers tab content */}
                <TabsContent value="customers" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Analytics</CardTitle>
                      <CardDescription>View and analyze customer data.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Search customers..."
                          className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      {topCustomers.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Customer ID</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Total Orders</TableHead>
                              <TableHead>Total Spent</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentTopCustomers.map((customer) => (
                              <TableRow key={customer.id}>
                                <TableCell className="font-medium">{customer.id}</TableCell>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>{customer.orders}</TableCell>
                                <TableCell>{customer.spent}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="flex h-[200px] items-center justify-center">
                          <div className="flex flex-col items-center text-center">
                            <Users className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                            <h3 className="mt-2 text-lg font-semibold">No customers found</h3>
                            <p className="text-sm text-muted-foreground">
                              There are no customers matching your criteria.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      {renderPagination(currentPage, customersTotalPages, setCurrentPage)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("Customers")}
                        disabled={exportLoading}
                      >
                        {exportLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>Export CSV</>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Add the Sales tab content */}
                <TabsContent value="sales" className="space-y-4">
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {/* Sales Overview Chart */}
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                        {isMobile && (
                          <CardDescription className="text-xs text-muted-foreground">
                            Tap on points for details
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="w-full overflow-hidden">
                          <ChartContainer
                            config={{
                              sales: {
                                label: "Sales",
                                color: "hsl(var(--chart-2))",
                              },
                            }}
                            className="h-[300px]"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="name"
                                  tick={{ fontSize: isMobile ? 10 : 12 }}
                                  tickFormatter={(value) => (isMobile ? value.substring(0, 1) : value)}
                                />
                                <YAxis
                                  tick={{ fontSize: isMobile ? 10 : 12 }}
                                  width={isMobile ? 30 : 40}
                                  tickFormatter={(value) => (isMobile ? `${value / 100}h` : value)}
                                />
                                <ChartTooltip
                                  content={<ChartTooltipContent />}
                                  cursor={{ strokeDasharray: "3 3" }}
                                  wrapperStyle={{ zIndex: 100 }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="sales"
                                  stroke="var(--color-sales)"
                                  strokeWidth={2}
                                  activeDot={{ r: 8, onClick: (e) => e.stopPropagation() }}
                                  isAnimationActive={!isMobile}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sales by Category */}
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        {isMobile && (
                          <CardDescription className="text-xs text-muted-foreground">
                            Tap on segments for details
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="w-full overflow-hidden">
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                <Pie
                                  data={categoryData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={isMobile ? 70 : 80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => {
                                    // On mobile, only show percentage
                                    if (isMobile) {
                                      return `${(percent * 100).toFixed(0)}%`
                                    }
                                    // On desktop, show name and percentage
                                    return `${name} ${(percent * 100).toFixed(0)}%`
                                  }}
                                  onClick={(data) => {
                                    if (isMobile) {
                                      toast.info(`${data.name}: ${(data.percent * 100).toFixed(0)}%`, {
                                        description: `${data.value} units sold`,
                                        duration: 3000,
                                      })
                                    }
                                  }}
                                >
                                  {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip
                                  formatter={(value) => [`${value} units`, "Sales"]}
                                  itemStyle={{ color: "var(--foreground)" }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Sales Performance</CardTitle>
                      <CardDescription>Monthly sales performance metrics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Units Sold</TableHead>
                            <TableHead>Growth</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {revenueData.map((item, index) => (
                            <TableRow key={item.name}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>${item.revenue.toLocaleString()}</TableCell>
                              <TableCell>{salesData[index].sales}</TableCell>
                              <TableCell>
                                {index > 0 ? (
                                  <div className="flex items-center">
                                    {item.revenue > revenueData[index - 1].revenue ? (
                                      <>
                                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                                        <span className="text-green-500">
                                          +
                                          {(
                                            ((item.revenue - revenueData[index - 1].revenue) /
                                              revenueData[index - 1].revenue) *
                                            100
                                          ).toFixed(1)}
                                          %
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                                        <span className="text-red-500">
                                          {(
                                            ((item.revenue - revenueData[index - 1].revenue) /
                                              revenueData[index - 1].revenue) *
                                            100
                                          ).toFixed(1)}
                                          %
                                        </span>
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  "—"
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("Sales")}
                        disabled={exportLoading}
                      >
                        {exportLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>Export CSV</>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>

      {/* Toaster for notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}

