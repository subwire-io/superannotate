"use client"

import { useState, useEffect, useRef } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
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
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  LineChartIcon,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Users,
  Bell,
  Menu,
  X,
  ChevronDown,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { useIsMobile } from "@/hooks/use-mobile"
import { Toaster, toast } from "sonner"

// Form schemas
const orderFormSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"], {
    required_error: "Please select an order status.",
  }),
  notes: z.string().optional(),
  notifyCustomer: z.boolean().default(false),
})

const searchFormSchema = z.object({
  query: z.string().min(1, "Please enter a search term"),
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
]

export default function Dashboard() {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [orders, setOrders] = useState(initialOrders)
  const [lowStockItems, setLowStockItems] = useState(initialLowStockItems)
  const [topCustomers, setTopCustomers] = useState(initialTopCustomers)
  const [searchTerm, setSearchTerm] = useState("")
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

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && !event.target.closest('[data-sidebar="true"]')) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, sidebarOpen])

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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Handle export functionality
  const handleExport = (type) => {
    setExportLoading(true)

    // Simulate export process
    setTimeout(() => {
      setExportLoading(false)

      const fileName = `${type.toLowerCase()}_export_${new Date().toISOString().split("T")[0]}.csv`

      toast.success(`${type} data has been exported as ${fileName}`, {
        description: "Your export is ready to download",
        action: {
          label: "Download",
          onClick: () => {
            toast.info(`${fileName} is being downloaded.`)
          },
        },
        duration: 5000,
      })
    }, 1500)
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

  // Handle adding a new order
  const handleAddOrder = () => {
    setIsLoading(true)

    // Simulate adding a new order
    setTimeout(() => {
      const newOrderId = `ORD-${(orders.length + 1).toString().padStart(3, "0")}`
      const newOrder = {
        id: newOrderId,
        customer: "New Customer",
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
        total: "$99.99",
      }

      setOrders((prevOrders) => [newOrder, ...prevOrders])
      setIsLoading(false)
      setShowAddOrderDialog(false)

      toast.success(`New order ${newOrderId} has been created`, {
        description: "The order has been added to the system",
      })
    }, 1000)
  }

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for larger screens */}
      <aside
        data-sidebar="true"
        className={`fixed inset-y-0 z-50 flex w-72 flex-col border-r bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <ShoppingBag className="mr-2 h-6 w-6" aria-hidden="true" />
          <span className="text-lg font-semibold">E-Commerce Dashboard</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-3">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Main</h2>
            <div className="space-y-1">
              <Button
                variant={activeTab === "overview" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("overview")}
                aria-current={activeTab === "overview" ? "page" : undefined}
              >
                <LineChartIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant={activeTab === "orders" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("orders")}
                aria-current={activeTab === "orders" ? "page" : undefined}
              >
                <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Orders</span>
              </Button>
              <Button
                variant={activeTab === "inventory" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("inventory")}
                aria-current={activeTab === "inventory" ? "page" : undefined}
              >
                <Package className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Products</span>
              </Button>
              <Button
                variant={activeTab === "customers" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("customers")}
                aria-current={activeTab === "customers" ? "page" : undefined}
              >
                <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Customers</span>
              </Button>
            </div>
          </div>
          <div className="mt-6 px-3">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reports</h2>
            <div className="space-y-1">
              <Button
                variant={activeTab === "sales" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("sales")}
                aria-current={activeTab === "sales" ? "page" : undefined}
              >
                <DollarSign className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Sales</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  toast.info("Transactions Report", {
                    description: "This feature will be available soon.",
                  })
                }}
              >
                <CreditCard className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Transactions</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  toast.info("Schedule Report", {
                    description: "This feature will be available soon.",
                  })
                }}
              >
                <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Schedule</span>
              </Button>
            </div>
          </div>
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User profile" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@example.com</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" aria-label="User menu">
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    toast.info("Profile", {
                      description: "Profile settings will be available soon.",
                    })
                  }}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    toast.info("Settings", {
                      description: "Settings will be available soon.",
                    })
                  }}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    toast.info("Logged out", {
                      description: "You have been logged out successfully.",
                    })
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Form {...searchForm}>
              <form onSubmit={searchForm.handleSubmit(onSearchSubmit)} className="relative">
                <FormField
                  control={searchForm.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Search
                            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <Input
                            {...field}
                            ref={searchInputRef}
                            type="search"
                            placeholder="Search... (Alt+S)"
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
                            aria-label="Search"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="h-5 w-5" aria-hidden="true" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    3
                  </span>
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex flex-col space-y-2 p-2">
                  <h3 className="font-medium">Notifications</h3>
                  <div className="text-sm text-muted-foreground">You have 3 unread notifications</div>
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex items-start gap-2 rounded-lg border p-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">New order received</p>
                        <p className="text-xs text-muted-foreground">Order #ORD-011 from Helen Garcia</p>
                      </div>
                      <div className="text-xs text-muted-foreground">5m ago</div>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg border p-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Low stock alert</p>
                        <p className="text-xs text-muted-foreground">Bluetooth Speaker is running low</p>
                      </div>
                      <div className="text-xs text-muted-foreground">1h ago</div>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg border p-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Payment received</p>
                        <p className="text-xs text-muted-foreground">Payment for order #ORD-008 received</p>
                      </div>
                      <div className="text-xs text-muted-foreground">3h ago</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2">
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    toast.info("Profile", {
                      description: "Profile settings will be available soon.",
                    })
                  }}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    toast.info("Settings", {
                      description: "Settings will be available soon.",
                    })
                  }}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    toast.info("Logged out", {
                      description: "You have been logged out successfully.",
                    })
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main dashboard content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <div className="flex flex-wrap items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span>Filter</span>
                      <ChevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex flex-col space-y-4 p-2">
                      <h3 className="font-medium">Date Range</h3>
                      <div className="flex flex-col space-y-2">
                        <CalendarComponent
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          className="rounded-md border"
                          disabled={(date) => date > new Date()}
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => setDateRange({ from: null, to: null })}>
                          Reset
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            toast.info(
                              dateRange.from && dateRange.to
                                ? `Showing data from ${format(dateRange.from, "PPP")} to ${format(dateRange.to, "PPP")}`
                                : "Showing all data",
                              {
                                description: "Filter applied",
                              },
                            )
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button size="sm" className="h-9" onClick={() => handleExport("Dashboard")} disabled={exportLoading}>
                  {exportLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span>Export</span>
                    </>
                  )}
                </Button>
                <div className="hidden items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground md:flex">
                  <span>Keyboard shortcuts:</span>
                  <kbd className="rounded bg-background px-1 text-[10px]">Alt</kbd>
                  <span>+</span>
                  <kbd className="rounded bg-background px-1 text-[10px]">S</kbd>
                  <span>to search</span>
                </div>
              </div>
            </div>

            {isInitialLoading ? (
              renderSkeleton()
            ) : (
              <>
                {/* Overview Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                      {/* Revenue Chart */}
                      <Card className="lg:col-span-4">
                        <CardHeader>
                          <CardTitle>Revenue Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
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
                              <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                  type="monotone"
                                  dataKey="revenue"
                                  stroke="var(--color-revenue)"
                                  strokeWidth={2}
                                  activeDot={{ r: 8 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </CardContent>
                      </Card>

                      {/* Sales by Category */}
                      <Card className="lg:col-span-3">
                        <CardHeader>
                          <CardTitle>Sales by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={categoryData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                  {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
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
                              <p className="text-sm text-muted-foreground">
                                There are no orders matching your criteria.
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
                          Previous
                        </Button>
                        <div className="text-sm text-muted-foreground">
                          Page {currentPage} of {totalPages || 1}
                        </div>
                        <Button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>
                          Next
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  {/* Orders Tab */}
                  <TabsContent value="orders" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <CardTitle>Order Management</CardTitle>
                            <CardDescription>Manage and process customer orders.</CardDescription>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button onClick={() => setShowAddOrderDialog(true)} size="sm" className="h-9">
                              <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
                              <span>New Order</span>
                            </Button>
                            <Button
                              onClick={() => handleExport("Orders")}
                              disabled={exportLoading}
                              size="sm"
                              className="h-9"
                            >
                              {exportLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                  <span>Exporting...</span>
                                </>
                              ) : (
                                <>
                                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                                  <span>Export Orders</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <Input
                              placeholder="Search orders..."
                              className="w-full md:w-[250px]"
                              value={orderSearchTerm}
                              onChange={(e) => setOrderSearchTerm(e.target.value)}
                              aria-label="Search orders"
                            />
                            <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                              <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter by status">
                                <SelectValue placeholder="Filter by status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Orders</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Select value={orderSort} onValueChange={setOrderSort}>
                            <SelectTrigger className="w-full md:w-[180px]" aria-label="Sort orders">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">Newest First</SelectItem>
                              <SelectItem value="oldest">Oldest First</SelectItem>
                              <SelectItem value="highest">Highest Value</SelectItem>
                              <SelectItem value="lowest">Lowest Value</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {isLoading ? (
                          <div className="flex h-[300px] items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
                            <span className="sr-only">Loading orders...</span>
                          </div>
                        ) : orders.length > 0 ? (
                          <div className="mt-4 overflow-hidden rounded-lg border">
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
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            aria-label={`Actions for order ${order.id}`}
                                          >
                                            <span className="sr-only">Open menu</span>
                                            <ChevronDown className="h-4 w-4" aria-hidden="true" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setSelectedOrder(order)
                                              toast.info(`Viewing details for order ${order.id}`, {
                                                description: "Order details",
                                              })
                                            }}
                                          >
                                            View details
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                            Update status
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => {
                                              toast.info(`Email sent to ${order.customer}`, {
                                                description: "Contact sent",
                                              })
                                            }}
                                          >
                                            Contact customer
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => setOrderToCancel(order)}
                                            disabled={order.status === "Cancelled"}
                                          >
                                            Cancel order
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="flex h-[300px] items-center justify-center">
                            <div className="flex flex-col items-center text-center">
                              <ShoppingCart className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                              <h3 className="mt-2 text-lg font-semibold">No orders found</h3>
                              <p className="text-sm text-muted-foreground">
                                {orderSearchTerm || orderStatusFilter !== "all"
                                  ? "Try adjusting your search or filter to find what you're looking for."
                                  : "There are no orders in the system yet."}
                              </p>
                              {(orderSearchTerm || orderStatusFilter !== "all") && (
                                <Button
                                  variant="outline"
                                  className="mt-4"
                                  onClick={() => {
                                    setOrderSearchTerm("")
                                    setOrderStatusFilter("all")
                                  }}
                                >
                                  Clear filters
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="text-sm text-muted-foreground">
                          Showing {orders.length > 0 ? indexOfFirstItem + 1 : 0}-
                          {Math.min(indexOfLastItem, orders.length)} of {orders.length} orders
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                          >
                            Next
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  {/* Inventory Tab */}
                  <TabsContent value="inventory" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                          <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">1,245</div>
                          <div className="text-xs text-muted-foreground">Across 15 categories</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                          <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {lowStockItems.filter((item) => item.stock < item.threshold).length}
                          </div>
                          <div className="text-xs text-muted-foreground">Items below threshold</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                          <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {lowStockItems.filter((item) => item.stock === 0).length}
                          </div>
                          <div className="text-xs text-muted-foreground">Items need restocking</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <CardTitle>Low Stock Items</CardTitle>
                            <CardDescription>Items that need to be restocked soon.</CardDescription>
                          </div>
                          <Button
                            onClick={() => handleExport("Inventory")}
                            disabled={exportLoading}
                            size="sm"
                            className="h-9"
                          >
                            {exportLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                <span>Exporting...</span>
                              </>
                            ) : (
                              <>
                                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                                <span>Export List</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
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
                              {currentLowStockItems.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium">{item.id}</TableCell>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.stock}</TableCell>
                                  <TableCell>{item.threshold}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant={
                                          item.stock === 0
                                            ? "destructive"
                                            : item.stock < item.threshold / 2
                                              ? "destructive"
                                              : item.stock < item.threshold
                                                ? "warning"
                                                : "default"
                                        }
                                      >
                                        {item.stock === 0
                                          ? "Out of Stock"
                                          : item.stock < item.threshold / 2
                                            ? "Critical"
                                            : item.stock < item.threshold
                                              ? "Low Stock"
                                              : "In Stock"}
                                      </Badge>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRestock(item.id)}
                                      disabled={restockLoading[item.id] || item.stock >= item.threshold}
                                    >
                                      {restockLoading[item.id] ? (
                                        <>
                                          <Loader2 className="mr-2 h-3 w-3 animate-spin" aria-hidden="true" />
                                          <span>Restocking...</span>
                                        </>
                                      ) : (
                                        "Restock"
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="flex h-[200px] items-center justify-center">
                            <div className="flex flex-col items-center text-center">
                              <Package className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                              <h3 className="mt-2 text-lg font-semibold">No low stock items</h3>
                              <p className="text-sm text-muted-foreground">All items are sufficiently stocked.</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
                          Previous
                        </Button>
                        <div className="text-sm text-muted-foreground">
                          Page {currentPage} of {lowStockTotalPages || 1}
                        </div>
                        <Button
                          onClick={handleNextPage}
                          disabled={currentPage === lowStockTotalPages || lowStockTotalPages === 0}
                        >
                          Next
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Inventory Overview</CardTitle>
                        <CardDescription>Stock levels by category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">Electronics</div>
                              <div className="text-sm text-muted-foreground">65% in stock</div>
                            </div>
                            <Progress value={65} aria-label="Electronics stock level" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">Clothing</div>
                              <div className="text-sm text-muted-foreground">82% in stock</div>
                            </div>
                            <Progress value={82} aria-label="Clothing stock level" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">Home & Kitchen</div>
                              <div className="text-sm text-muted-foreground">45% in stock</div>
                            </div>
                            <Progress value={45} aria-label="Home & Kitchen stock level" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">Books</div>
                              <div className="text-sm text-muted-foreground">95% in stock</div>
                            </div>
                            <Progress value={95} aria-label="Books stock level" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">Beauty</div>
                              <div className="text-sm text-muted-foreground">70% in stock</div>
                            </div>
                            <Progress value={70} aria-label="Beauty stock level" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Customers Tab */}
                  <TabsContent value="customers" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">12,234</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" aria-hidden="true" />
                            <span className="text-green-500">+5.4%</span>
                            <span className="ml-1 text-muted-foreground">from last month</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">321</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" aria-hidden="true" />
                            <span className="text-green-500">+12.3%</span>
                            <span className="ml-1 text-muted-foreground">from last month</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
                          <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">64%</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" aria-hidden="true" />
                            <span className="text-green-500">+2.1%</span>
                            <span className="ml-1 text-muted-foreground">from last month</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                          <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">$85.25</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" aria-hidden="true" />
                            <span className="text-green-500">+3.2%</span>
                            <span className="ml-1 text-muted-foreground">from last month</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <CardTitle>Top Customers</CardTitle>
                            <CardDescription>Your most valuable customers by total spend.</CardDescription>
                          </div>
                          <Button
                            onClick={() => handleExport("Customers")}
                            disabled={exportLoading}
                            size="sm"
                            className="h-9"
                          >
                            {exportLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                <span>Exporting...</span>
                              </>
                            ) : (
                              <>
                                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                                <span>Export Customers</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
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
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        toast.info(`Viewing details for ${customer.name}`, {
                                          description: "Customer details",
                                        })
                                      }}
                                    >
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
                              <p className="text-sm text-muted-foreground">There are no customers in the system yet.</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
                          Previous
                        </Button>
                        <div className="text-sm text-muted-foreground">
                          Page {currentPage} of {customersTotalPages || 1}
                        </div>
                        <Button
                          onClick={handleNextPage}
                          disabled={currentPage === customersTotalPages || customersTotalPages === 0}
                        >
                          Next
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Acquisition</CardTitle>
                        <CardDescription>New customers over time</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            sales: {
                              label: "New Customers",
                              color: "hsl(var(--chart-1))",
                            },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Sales Tab */}
                  <TabsContent value="sales" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                          <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">$45,231.89</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" aria-hidden="true" />
                            <span className="text-green-500">+20.1%</span>
                            <span className="ml-1 text-muted-foreground">from last month</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                          <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">$85.25</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" aria-hidden="true" />
                            <span className="text-green-500">+3.2%</span>
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
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" aria-hidden="true" />
                            <span className="text-red-500">-0.5%</span>
                            <span className="ml-1 text-muted-foreground">from last month</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <CardTitle>Sales Overview</CardTitle>
                            <CardDescription>Monthly sales performance</CardDescription>
                          </div>
                          <Button
                            onClick={() => handleExport("Sales")}
                            disabled={exportLoading}
                            size="sm"
                            className="h-9"
                          >
                            {exportLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                <span>Exporting...</span>
                              </>
                            ) : (
                              <>
                                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                                <span>Export Sales</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
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
                            <LineChart data={revenueData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="var(--color-revenue)"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        <CardDescription>Distribution of sales across product categories</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Order Status Update Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>Change the status for order {selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          <Form {...orderForm}>
            <form onSubmit={orderForm.handleSubmit(handleUpdateOrderStatus)} className="space-y-4">
              <FormField
                control={orderForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={orderForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add notes about this status change" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={orderForm.control}
                name="notifyCustomer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notify Customer</FormLabel>
                      <FormDescription>Send an email notification to the customer</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setSelectedOrder(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Order Cancellation Alert Dialog */}
      <AlertDialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel order {orderToCancel?.id}? This action can be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Cancelling...</span>
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add New Order Dialog */}
      <Dialog open={showAddOrderDialog} onOpenChange={setShowAddOrderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
            <DialogDescription>Create a new customer order in the system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <div className="flex flex-col space-y-1.5">
                  <FormLabel htmlFor="customer-name">Customer Name</FormLabel>
                  <Input id="customer-name" placeholder="Enter customer name" />
                </div>
              </div>
              <div className="col-span-4">
                <div className="flex flex-col space-y-1.5">
                  <FormLabel htmlFor="order-total">Order Total</FormLabel>
                  <Input id="order-total" placeholder="Enter order total" type="number" min="0" step="0.01" />
                </div>
              </div>
              <div className="col-span-4">
                <div className="flex flex-col space-y-1.5">
                  <FormLabel htmlFor="order-status">Status</FormLabel>
                  <Select defaultValue="pending">
                    <SelectTrigger id="order-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddOrderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOrder} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Creating...</span>
                </>
              ) : (
                "Create Order"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Sonner Toast Container */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}

