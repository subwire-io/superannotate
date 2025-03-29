"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { Loader2, Package } from "lucide-react"
import { toast } from "sonner"
import { initialLowStockItems } from "@/lib/data"
import { downloadCSV } from "@/lib/utils"

export function InventoryTab() {
  const [lowStockItems, setLowStockItems] = useState(initialLowStockItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [exportLoading, setExportLoading] = useState(false)
  const [restockLoading, setRestockLoading] = useState<Record<string, boolean>>({})

  // Filter items based on search
  const filteredItems = lowStockItems.filter(
    (item) =>
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  // Handle export functionality
  const handleExport = () => {
    setExportLoading(true)

    // Simulate export process
    setTimeout(() => {
      setExportLoading(false)
      const fileName = `inventory_export_${new Date().toISOString().split("T")[0]}.csv`
      downloadCSV(lowStockItems, fileName)
    }, 1000)
  }

  // Handle restock functionality
  const handleRestock = (itemId: string) => {
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

  return (
    <Card>
      <CardHeader className="pb-6">
        <CardTitle className="text-xl mb-2">Inventory Management</CardTitle>
        <CardDescription className="text-muted-foreground">Monitor stock levels and restock items.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search inventory..."
            className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {currentItems.length > 0 ? (
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
              {currentItems.map((item) => {
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
              <h3 className="mt-2 text-lg font-semibold">No items found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm
                  ? "No items match your search criteria."
                  : "All inventory items are at healthy stock levels."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        <Button variant="outline" size="sm" onClick={handleExport} disabled={exportLoading}>
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
  )
}

