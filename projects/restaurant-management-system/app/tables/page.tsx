"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { tables } from "@/data/mock-data"
import type { Table as TableType } from "@/types"

export default function TablesPage() {
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null)
  const [tableData, setTableData] = useState(tables)
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredTables = filterStatus === "all" ? tableData : tableData.filter((table) => table.status === filterStatus)

  const handleStatusChange = (tableId: string, newStatus: TableType["status"]) => {
    setTableData((prev) => prev.map((table) => (table.id === tableId ? { ...table, status: newStatus } : table)))
  }

  const getTableColor = (status: TableType["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 border-green-500 dark:bg-green-900/30"
      case "occupied":
        return "bg-red-100 border-red-500 dark:bg-red-900/30"
      case "reserved":
        return "bg-blue-100 border-blue-500 dark:bg-blue-900/30"
      case "cleaning":
        return "bg-yellow-100 border-yellow-500 dark:bg-yellow-900/30"
      default:
        return "bg-gray-100 border-gray-500"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tables</h1>
          <p className="text-muted-foreground">Manage restaurant tables and their status</p>
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tables</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Table</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Table</DialogTitle>
                <DialogDescription>Enter the details for the new table.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table-number" className="text-right">
                    Table Number
                  </Label>
                  <Input id="table-number" type="number" className="col-span-3" placeholder="Enter table number" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacity
                  </Label>
                  <Input id="capacity" type="number" className="col-span-3" placeholder="Enter capacity" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input id="location" className="col-span-3" placeholder="Enter location description" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Table</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTables.map((table) => (
          <Card
            key={table.id}
            className={`${getTableColor(table.status)} border-l-4 hover:shadow-md transition-shadow`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Table {table.number}</CardTitle>
                <div className="flex gap-1">
                  <Select
                    value={table.status}
                    onValueChange={(value) => handleStatusChange(table.id, value as TableType["status"])}
                  >
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 px-2">
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Table {table.number}</DialogTitle>
                        <DialogDescription>Update the details for this table.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-number" className="text-right">
                            Table Number
                          </Label>
                          <Input id="edit-number" type="number" className="col-span-3" defaultValue={table.number} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-capacity" className="text-right">
                            Capacity
                          </Label>
                          <Input
                            id="edit-capacity"
                            type="number"
                            className="col-span-3"
                            defaultValue={table.capacity}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-location" className="text-right">
                            Location
                          </Label>
                          <Input id="edit-location" className="col-span-3" defaultValue={table.locationDescription} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <CardDescription>
                {table.locationDescription} - Capacity: {table.capacity} people
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="text-sm">
                  <span className="font-medium">Status: </span>
                  <span className="capitalize">{table.status}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/reservations?table=${table.id}`}>View Reservations</Link>
                  </Button>
                  {(table.status === "available" || table.status === "reserved") && (
                    <Button size="sm">
                      <Link href={`/orders/new?table=${table.id}`}>Create Order</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

