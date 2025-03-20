import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const attendanceRecords = [
  {
    id: 1,
    employee: {
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AM",
      department: "Engineering",
    },
    date: "Aug 15, 2023",
    status: "Present",
    checkIn: "8:55 AM",
    checkOut: "5:05 PM",
    workHours: "8h 10m",
  },
  {
    id: 2,
    employee: {
      name: "Taylor Swift",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TS",
      department: "Marketing",
    },
    date: "Aug 15, 2023",
    status: "Late",
    checkIn: "9:22 AM",
    checkOut: "5:30 PM",
    workHours: "8h 08m",
  },
  {
    id: 3,
    employee: {
      name: "Jordan Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JL",
      department: "Product",
    },
    date: "Aug 15, 2023",
    status: "Late",
    checkIn: "9:08 AM",
    checkOut: "5:15 PM",
    workHours: "8h 07m",
  },
  {
    id: 4,
    employee: {
      name: "Casey Zhang",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CZ",
      department: "Design",
    },
    date: "Aug 15, 2023",
    status: "Absent",
    checkIn: "-",
    checkOut: "-",
    workHours: "-",
  },
  {
    id: 5,
    employee: {
      name: "Jamie Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JR",
      department: "Sales",
    },
    date: "Aug 15, 2023",
    status: "Absent",
    checkIn: "-",
    checkOut: "-",
    workHours: "-",
  },
  {
    id: 6,
    employee: {
      name: "Morgan Freeman",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MF",
      department: "HR",
    },
    date: "Aug 15, 2023",
    status: "On Leave",
    checkIn: "-",
    checkOut: "-",
    workHours: "-",
    note: "Vacation",
  },
]

export function AttendanceTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="lastWeek">Last Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing <strong>142</strong> employees
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Work Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={record.employee.avatar} alt={record.employee.name} />
                      <AvatarFallback>{record.employee.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{record.employee.name}</div>
                      <div className="text-sm text-muted-foreground">{record.employee.department}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      record.status === "Present"
                        ? "default"
                        : record.status === "Late"
                          ? "outline"
                          : record.status === "Absent"
                            ? "destructive"
                            : "secondary"
                    }
                  >
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell>{record.checkIn}</TableCell>
                <TableCell>{record.checkOut}</TableCell>
                <TableCell>{record.workHours}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

