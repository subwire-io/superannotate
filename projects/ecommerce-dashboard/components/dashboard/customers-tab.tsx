"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { Loader2, Users } from "lucide-react"
import { initialTopCustomers } from "@/lib/data"
import { downloadCSV } from "@/lib/utils"

export function CustomersTab() {
  const [customers, setCustomers] = useState(initialTopCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [exportLoading, setExportLoading] = useState(false)

  // Filter customers based on search
  const filteredCustomers = customers.filter(
    (customer) =>
      searchTerm === "" ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)

  // Handle export functionality
  const handleExport = () => {
    setExportLoading(true)

    // Simulate export process
    setTimeout(() => {
      setExportLoading(false)
      const fileName = `customers_export_${new Date().toISOString().split("T")[0]}.csv`
      downloadCSV(customers, fileName)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader className="pb-6">
        <CardTitle className="text-xl mb-2">Customer Analytics</CardTitle>
        <CardDescription className="text-muted-foreground">View and analyze customer data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {currentCustomers.length > 0 ? (
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
              {currentCustomers.map((customer) => (
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
                {searchTerm ? "No customers match your search criteria." : "There are no customers in the system."}
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

