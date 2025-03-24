"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"

import { generateTimeSlots } from "@/lib/utils"
import { reservations, tables } from "@/data/mock-data"
import type { Table as TableType, Reservation } from "@/types"

// Import the toast utility
import { showToast } from "@/lib/toast-utils"

// Form schema for adding a new table
const tableFormSchema = z.object({
  tableNumber: z.coerce.number().min(1, "Table number must be at least 1"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  location: z.string().optional(),
})

// Form schema for adding a new reservation
const reservationFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  partySize: z.coerce.number().min(1, "Party size must be at least 1"),
  tableId: z.string().min(1, "Please select a table"),
  notes: z.string().optional(),
})

export default function TablesPage() {
  const [selectedTab, setSelectedTab] = useState<string>("tables")
  const [tableData, setTableData] = useState(tables)
  const [filterStatus, setFilterStatus] = useState("all")
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [filterReservationStatus, setFilterReservationStatus] = useState<string>("all")
  const [searchText, setSearchText] = useState<string>("")
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const [reservationData, setReservationData] = useState<Reservation[]>(reservations)
  const [isAddTableOpen, setIsAddTableOpen] = useState(false)
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false)

  // Setup forms with react-hook-form
  const tableForm = useForm<z.infer<typeof tableFormSchema>>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: {
      tableNumber: 1,
      capacity: 1,
      location: "",
    },
  })

  const reservationForm = useForm<z.infer<typeof reservationFormSchema>>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: date,
      time: "",
      partySize: 1,
      tableId: selectedTableId || "",
      notes: "",
    },
  })

  // Filter tables
  const filteredTables = filterStatus === "all" ? tableData : tableData.filter((table) => table.status === filterStatus)

  // Filter reservations
  const filteredReservations = reservationData.filter((reservation) => {
    // Filter by date
    const matchesDate = reservation.date === date

    // Filter by status
    const matchesStatus = filterReservationStatus === "all" || reservation.status === filterReservationStatus

    // Filter by table if selected
    const matchesTable = selectedTableId === null || reservation.tableId === selectedTableId

    // Filter by search text (customer name or email)
    const matchesSearch =
      searchText === "" ||
      reservation.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      reservation.customerEmail.toLowerCase().includes(searchText.toLowerCase())

    return matchesDate && matchesStatus && matchesTable && matchesSearch
  })

  // Time slots for new reservations
  const timeSlots = generateTimeSlots()

  const handleStatusChange = (tableId: string, newStatus: TableType["status"]) => {
    setTableData((prev) => prev.map((table) => (table.id === tableId ? { ...table, status: newStatus } : table)))
    showToast.success(`Table status updated to ${newStatus}`)
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

  const onTableSubmit = (data: z.infer<typeof tableFormSchema>) => {
    const newTable: TableType = {
      id: `new-${Date.now()}`, // Ensure unique ID
      number: data.tableNumber,
      capacity: data.capacity,
      status: "available",
      locationDescription: data.location || undefined,
    }

    setTableData([...tableData, newTable])
    showToast.success(`Table ${data.tableNumber} added successfully`)
    tableForm.reset({
      tableNumber: 1,
      capacity: 1,
      location: "",
    })
    setIsAddTableOpen(false)
  }

  const onReservationSubmit = (data: z.infer<typeof reservationFormSchema>) => {
    const newReservation: Reservation = {
      id: `new-${Date.now()}`, // Ensure unique ID
      customerName: data.name,
      customerEmail: data.email,
      customerPhone: data.phone,
      date: data.date,
      time: data.time,
      partySize: data.partySize,
      tableId: data.tableId,
      status: "confirmed",
      notes: data.notes || undefined,
      createdAt: new Date().toISOString(),
    }

    setReservationData([...reservationData, newReservation])

    // Update table status to reserved
    setTableData((prev) => prev.map((table) => (table.id === data.tableId ? { ...table, status: "reserved" } : table)))

    showToast.success(`Reservation for ${data.name} created successfully`)
    reservationForm.reset({
      name: "",
      email: "",
      phone: "",
      date: date,
      time: "",
      partySize: 1,
      tableId: "",
      notes: "",
    })
    setIsAddReservationOpen(false)
  }

  const viewTableReservations = (tableId: string) => {
    setSelectedTableId(tableId)
    setSelectedTab("reservations")
  }

  const clearTableFilter = () => {
    setSelectedTableId(null)
  }

  // Handle dialog open state changes
  const handleAddTableOpenChange = (open: boolean) => {
    setIsAddTableOpen(open)
    if (!open) {
      // Reset form when dialog closes
      tableForm.reset({
        tableNumber: 1,
        capacity: 1,
        location: "",
      })
    }
  }

  const handleAddReservationOpenChange = (open: boolean) => {
    setIsAddReservationOpen(open)
    if (open && selectedTableId) {
      // If a table is selected, pre-fill the form
      reservationForm.setValue("tableId", selectedTableId)
    }
    if (!open) {
      // Reset form when dialog closes
      reservationForm.reset({
        name: "",
        email: "",
        phone: "",
        date: date,
        time: "",
        partySize: 1,
        tableId: selectedTableId || "",
        notes: "",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tables & Reservations</h1>
          <p className="text-muted-foreground">Manage restaurant tables and reservations</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-2">
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
            <Dialog open={isAddTableOpen} onOpenChange={handleAddTableOpenChange}>
              <DialogTrigger asChild>
                <Button>Add Table</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Add New Table</DialogTitle>
                  <DialogDescription>Enter the details for the new table.</DialogDescription>
                </DialogHeader>
                <Form {...tableForm}>
                  <form onSubmit={tableForm.handleSubmit(onTableSubmit)} className="space-y-4">
                    <FormField
                      control={tableForm.control}
                      name="tableNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Table Number</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter table number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={tableForm.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter capacity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={tableForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter location description" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Save Table</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-4">
            {filteredTables.length === 0 ? (
              <div className="col-span-full text-center py-12 px-6">
                <div className="mx-auto max-w-md">
                  <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No tables found</h3>
                  <p className="text-muted-foreground mt-1">No tables found matching the selected filter</p>
                </div>
              </div>
            ) : (
              filteredTables.map((table) => (
                <Card
                  key={table.id}
                  className={`${getTableColor(table.status)} border-l-4 hover:border-primary/20 transition-all h-full`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
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
                    <CardDescription className="break-words">
                      {table.locationDescription} - Capacity: {table.capacity} people
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm">
                        <span className="font-medium">Status: </span>
                        <span className="capitalize">{table.status}</span>
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewTableReservations(table.id)}
                          className="w-full text-sm"
                        >
                          View Reservations
                        </Button>
                        {(table.status === "available" || table.status === "reserved") && (
                          <Button size="sm" className="w-full text-sm">
                            <Link href={`/orders/new?table=${table.id}`} className="w-full block">
                              Create Order
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div>
                <CardTitle className="flex flex-wrap items-center gap-2">
                  Reservations Calendar
                  {selectedTableId && (
                    <Button variant="outline" size="sm" onClick={clearTableFilter}>
                      Clear Table Filter
                    </Button>
                  )}
                </CardTitle>
                <CardDescription className="break-words">
                  {selectedTableId
                    ? `Showing reservations for Table ${tableData.find((t) => t.id === selectedTableId)?.number}`
                    : "Manage and view all reservations"}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
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
                  <Dialog open={isAddReservationOpen} onOpenChange={handleAddReservationOpenChange}>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" /> New Reservation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Reservation</DialogTitle>
                        <DialogDescription>Enter the customer details and reservation information</DialogDescription>
                      </DialogHeader>
                      <Form {...reservationForm}>
                        <form onSubmit={reservationForm.handleSubmit(onReservationSubmit)} className="space-y-4">
                          <FormField
                            control={reservationForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Customer name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={reservationForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Email address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={reservationForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input placeholder="Phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={reservationForm.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={reservationForm.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Time</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger>
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
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={reservationForm.control}
                            name="partySize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Party Size</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="Number of guests" min="1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={reservationForm.control}
                            name="tableId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Table</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select table" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {tableData
                                        .filter((table) => table.status === "available")
                                        .map((table) => (
                                          <SelectItem key={table.id} value={table.id}>
                                            Table {table.number} - Seats {table.capacity}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={reservationForm.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                  <Input placeholder="Special requests or notes" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="submit">Create Reservation</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="rounded-md border">
                {filteredReservations.length === 0 ? (
                  <div className="text-center py-12 px-6 w-full">
                    <div className="mx-auto max-w-md">
                      <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">No reservations found</h3>
                      <p className="text-muted-foreground mt-1">
                        No reservations found for this date or search criteria
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[650px]">
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
                          {filteredReservations.map((reservation) => (
                            <TableRow key={reservation.id}>
                              <TableCell className="max-w-[150px]">
                                <div className="font-medium truncate">{reservation.customerName}</div>
                                <div className="text-sm text-muted-foreground truncate">
                                  {reservation.customerEmail}
                                </div>
                              </TableCell>
                              <TableCell>{reservation.time}</TableCell>
                              <TableCell>Table {tableData.find((t) => t.id === reservation.tableId)?.number}</TableCell>
                              <TableCell>{reservation.partySize} guests</TableCell>
                              <TableCell>
                                <Select
                                  defaultValue={reservation.status}
                                  onValueChange={(value) => {
                                    setReservationData((prev) =>
                                      prev.map((res) =>
                                        res.id === reservation.id
                                          ? { ...res, status: value as Reservation["status"] }
                                          : res,
                                      ),
                                    )
                                    showToast.success(`Reservation status updated to ${value}`)
                                  }}
                                >
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
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

