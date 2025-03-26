import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

// Utility for conditionally joining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate pagination items
export const generatePaginationItems = (currentPage: number, totalPages: number) => {
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

// Create and download a CSV file
export const downloadCSV = (data: any[], filename: string) => {
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
    data.forEach((item) => {
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

  toast.success(`${filename.split("_")[0]} data has been exported`, {
    description: "Your export is ready to download",
    duration: 5000,
  })
}

// Handle chart element click for mobile
export const handleChartElementClick = (data: any, category: string, isMobile: boolean) => {
  if (isMobile) {
    let message = ""
    let description = ""

    if (category === "revenue") {
      message = `${data.name}: $${data.revenue.toLocaleString()}`
      description = `Revenue for ${data.name}`
    } else if (category === "sales") {
      message = `${data.name}: ${data.sales} units`
      description = `Sales for ${data.name}`
    } else if (category === "category") {
      message = `${data.name}: ${data.value} units`
      description = `${((data.value / 1150) * 100).toFixed(0)}% of total sales`
    }

    toast.info(message, {
      description,
      duration: 3000,
    })
  }
}

