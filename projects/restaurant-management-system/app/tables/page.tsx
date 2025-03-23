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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"

import { generateTimeSlots } from "@/lib/utils"
import { reservations, tables } from "@/data/mock-data"
import type { Table as TableType } from "@/types"

export default function TablesPage() {
  const [selectedTab, setSelectedTab] = useState<string>("tables")
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null)
  const [tableData, setTableData] = useState(tables)
  const [filterStatus, setFilterStatus] = useState("all")
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [filterReservationStatus, setFilterReservationStatus] = useState<string>("all")
  const [searchText, setSearchText] = useState<string>("")

  // Filter tables
  const filteredTables = filterStatus === "all" ? tableData : tableData.filter((table) => table.status === filterStatus)

  // Filter reservations
  const filteredReservations = reservations.filter((reservation) => {
    // Filter by date
    const matchesDate = reservation.date === date

    // Filter by status
    const matchesStatus = filterReservationStatus === "all" || reservation.status === filterReservationStatus

    // Filter by search text (customer name or email)
    const matchesSearch =
      searchText === "" ||
      reservation.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      reservation.customerEmail.toLowerCase().includes(searchText.toLowerCase())

    return matchesDate && matchesStatus && matchesSearch
  })

  // Time slots for new reservations
  const timeSlots = generateTimeSlots()

  const handleStatusChange = (tableId: string, newStatus: TableType["status"]) => {
    setTableData((prev) => prev.map((table) => (table.id === tableId ? { ...table, status: newStatus } : table)))
  }

  const handlePreviousDay = () => {
    const currentDate = new Date(date)
    currentDate.setDate(currentDate.getDate() - 1)
    setDate(currentDate.toISOString().split("T")[0])
  }

  const handleNextDay = () => {
    const currentDate = new Date(date)
    currentDate.setDate(currentDate.getDate() + 1)
    setDate(currentDate.toISOString().split("T")[0])
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
    <div className="flex flex-col gap-4 px-2 sm:px-4 md:px-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tables & Reservations</h1>
          <p className="text-muted-foreground">Manage restaurant tables and reservations</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="tables" className="flex-1">
            Tables
          </TabsTrigger>
          <TabsTrigger value="reservations" className="flex-1">
            Reservations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
              <DialogContent className="sm:max-w-[425px]">
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

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTables.map((table) => (
              <Card
                key={table.id}
                className={`${getTableColor(table.status)} border-l-4 hover:shadow-md transition-shadow`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Table {table.number}</CardTitle>
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
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTab("reservations")
                        }}
                        className="w-full sm:w-auto"
                      >
                        View Reservations
                      </Button>
                      {(table.status === "available" || table.status === "reserved") && (
                        <Button size="sm" className="w-full sm:w-auto">
                          <Link href={`/orders/new?table=${table.id}`}>Create Order</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div>
                <CardTitle>Reservations Calendar</CardTitle>
                <CardDescription>Manage and view all reservations</CardDescription>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <Button variant="outline" size="icon" onClick={handlePreviousDay}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-[160px]" />
                </div>
                <Button variant="outline" size="icon" onClick={handleNextDay}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="flex items-center w-full sm:w-1/3 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reservations..."
                    className="pl-8"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Select value={filterReservationStatus} onValueChange={setFilterReservationStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" /> New Reservation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Create New Reservation</DialogTitle>
                        <DialogDescription>Enter the customer details and reservation information</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input id="name" className="col-span-3" placeholder="Customer name" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input id="email" type="email" className="col-span-3" placeholder="Email address" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="phone" className="text-right">
                            Phone
                          </Label>
                          <Input id="phone" className="col-span-3" placeholder="Phone number" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="res-date" className="text-right">
                            Date
                          </Label>
                          <Input id="res-date" type="date" className="col-span-3" defaultValue={date} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="res-time" className="text-right">
                            Time
                          </Label>
                          <Select>
                            <SelectTrigger id="res-time" className="col-span-3">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="party-size" className="text-right">
                            Party Size
                          </Label>
                          <Input
                            id="party-size"
                            type="number"
                            className="col-span-3"
                            placeholder="Number of guests"
                            min="1"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="table" className="text-right">
                            Table
                          </Label>
                          <Select>
                            <SelectTrigger id="table" className="col-span-3">
                              <SelectValue placeholder="Select table" />
                            </SelectTrigger>
                            <SelectContent>
                              {tables
                                .filter((table) => table.status === "available")
                                .map((table) => (
                                  <SelectItem key={table.id} value={table.id}>
                                    Table {table.number} - Seats {table.capacity}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Create Reservation</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <ScrollArea className="w-full overflow-auto">
                  <div className="min-w-[800px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Table</TableHead>
                          <TableHead>Party Size</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReservations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              No reservations found for this date or search criteria
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredReservations.map((reservation) => (
                            <TableRow key={reservation.id}>
                              <TableCell>
                                <div className="font-medium">{reservation.customerName}</div>
                                <div className="text-sm text-muted-foreground">{reservation.customerEmail}</div>
                              </TableCell>
                              <TableCell>{reservation.time}</TableCell>
                              <TableCell>Table {tables.find((t) => t.id === reservation.tableId)?.number}</TableCell>
                              <TableCell>{reservation.partySize} guests</TableCell>
                              <TableCell>
                                <Select defaultValue={reservation.status}>
                                  <SelectTrigger className="w-[130px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

