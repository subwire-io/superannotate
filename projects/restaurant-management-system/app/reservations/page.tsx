"use client"

import { useState } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"

import { formatDate, formatTime, generateTimeSlots, getNextWeekDates } from "@/lib/utils"
import { reservations, tables } from "@/data/mock-data"
import type { Reservation } from "@/types"

export default function ReservationsPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchText, setSearchText] = useState<string>("")

  // Get next 7 days for date picker
  const nextWeekDates = getNextWeekDates()

  // Time slots for new reservations
  const timeSlots = generateTimeSlots()

  const filteredReservations = reservations.filter((reservation) => {
    // Filter by date
    const matchesDate = reservation.date === date

    // Filter by status
    const matchesStatus = filterStatus === "all" || reservation.status === filterStatus

    // Filter by search text (customer name or email)
    const matchesSearch =
      searchText === "" ||
      reservation.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      reservation.customerEmail.toLowerCase().includes(searchText.toLowerCase())

    return matchesDate && matchesStatus && matchesSearch
  })

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

  const handleStatusChange = (reservationId: string, newStatus: Reservation["status"]) => {
    // In a real app, update the reservation status in the database
    console.log(`Changing reservation ${reservationId} status to ${newStatus}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground">Manage restaurant reservations</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
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
                  <Input id="party-size" type="number" className="col-span-3" placeholder="Number of guests" min="1" />
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea id="notes" className="col-span-3" placeholder="Special requests or notes" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Reservation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <div className="flex items-center w-full md:w-1/3 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reservations..."
                className="pl-8"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
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
          </div>

          <div className="rounded-md border">
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
                        <Select
                          defaultValue={reservation.status}
                          onValueChange={(value) => handleStatusChange(reservation.id, value as Reservation["status"])}
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reservation Details</DialogTitle>
                              <DialogDescription>
                                Reservation for {reservation.customerName} on {formatDate(reservation.date)} at{" "}
                                {formatTime(reservation.time)}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Customer</Label>
                                <div className="col-span-3">{reservation.customerName}</div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Contact</Label>
                                <div className="col-span-3">
                                  {reservation.customerEmail}
                                  <br />
                                  {reservation.customerPhone}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Date & Time</Label>
                                <div className="col-span-3">
                                  {formatDate(reservation.date)} at {formatTime(reservation.time)}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Table</Label>
                                <div className="col-span-3">
                                  Table {tables.find((t) => t.id === reservation.tableId)?.number}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right font-medium">Party Size</Label>
                                <div className="col-span-3">{reservation.partySize} guests</div>
                              </div>
                              {reservation.notes && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right font-medium">Notes</Label>
                                  <div className="col-span-3">{reservation.notes}</div>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Edit</Button>
                              <Button variant="destructive">Cancel Reservation</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

