"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useMobile } from "@/hooks/use-mobile"
import { Separator } from "@/components/ui/separator"

export default function AttendancePage() {
  const isMobile = useMobile()
  const [currentMonth] = useState(new Date())

  const handleGenerateReport = () => {
    toast.success("Attendance report has been generated successfully.")
  }

  // Sample attendance data
  const attendanceData = [
    {
      id: "1",
      date: "2023-05-01",
      employee: "John Smith",
      status: "present",
      timeIn: "09:00 AM",
      timeOut: "05:30 PM",
    },
    {
      id: "2",
      date: "2023-05-01",
      employee: "Sarah Johnson",
      status: "present",
      timeIn: "08:45 AM",
      timeOut: "05:15 PM",
    },
    {
      id: "3",
      date: "2023-05-01",
      employee: "Michael Brown",
      status: "late",
      timeIn: "10:15 AM",
      timeOut: "06:00 PM",
    },
    {
      id: "4",
      date: "2023-05-01",
      employee: "Emily Davis",
      status: "absent",
      timeIn: "",
      timeOut: "",
    },
    {
      id: "5",
      date: "2023-05-02",
      employee: "John Smith",
      status: "present",
      timeIn: "08:55 AM",
      timeOut: "05:20 PM",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <div className="flex gap-2">
          <Button onClick={handleGenerateReport}>Generate Report</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })} attendance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {isMobile ? (
              // Mobile view - card-based layout with improved spacing
              <div className="divide-y">
                {attendanceData.map((record) => (
                  <div key={record.id} className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-base">{record.employee}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        className={`px-3 py-1 ${
                          record.status === "present"
                            ? "bg-green-100 text-green-800"
                            : record.status === "late"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </div>

                    <Separator className="my-2" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                          Time In
                        </span>
                        <span className="font-medium mt-1">{record.timeIn || "-"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                          Time Out
                        </span>
                        <span className="font-medium mt-1">{record.timeOut || "-"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop view - table layout
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="px-4 py-2 text-left font-medium">Date</th>
                    <th className="px-4 py-2 text-left font-medium">Employee</th>
                    <th className="px-4 py-2 text-left font-medium">Status</th>
                    <th className="px-4 py-2 text-left font-medium">Time In</th>
                    <th className="px-4 py-2 text-left font-medium">Time Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {attendanceData.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{record.employee}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "late"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{record.timeIn || "-"}</td>
                      <td className="px-4 py-3">{record.timeOut || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

