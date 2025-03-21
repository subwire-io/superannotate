"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, FileText, MessageSquare, Pill } from "lucide-react"
import Link from "next/link"
import AppointmentCard from "@/components/appointment-card"
import NotificationList from "@/components/notification-list"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ScheduleAppointmentForm } from "@/components/schedule-appointment-form"

export default function DashboardPage() {
  const { toast } = useToast()
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <Toaster />
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:items-start sm:justify-between sm:pb-0 lg:px-8 lg:py-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold sm:text-2xl">Welcome, John</h1>
          <p className="text-sm text-muted-foreground">Your health dashboard and recent activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/messages">
            <Button variant="outline" size="icon" className="relative">
              <MessageSquare className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>
          </Link>
        </div>
      </header>
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointment</CardTitle>
              <Calendar className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <AppointmentCard
                doctor="Dr. Sarah Johnson"
                specialty="Cardiology"
                date="June 15, 2024"
                time="10:00 AM"
                isUpcoming={true}
              />
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => setIsScheduleModalOpen(true)}>
                  Schedule New
                </Button>
                <Link href="/appointments" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">
                    View All
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medication Reminder</CardTitle>
              <Pill className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">Lisinopril 10mg</p>
                    <p className="text-xs text-muted-foreground">1 tablet daily</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Medication Reminder",
                          description: "Reminder set for Lisinopril at 9:00 AM",
                        })
                      }}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      9:00 AM
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Metformin 500mg</p>
                    <p className="text-xs text-muted-foreground">2 tablets daily</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Medication Reminder",
                          description: "Reminder set for Metformin at 8:00 PM",
                        })
                      }}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      8:00 PM
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/prescriptions">
                  <Button size="sm" variant="secondary" className="w-full">
                    View All Medications
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <FileText className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <NotificationList />
              <div className="mt-4">
                <Link href="/medical-records">
                  <Button size="sm" variant="secondary" className="w-full">
                    View All Records
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Health Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <div className="text-xs font-medium text-muted-foreground">Blood Pressure</div>
                <div className="text-2xl font-bold">120/80</div>
                <div className="text-xs text-muted-foreground">Last checked: June 1, 2024</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs font-medium text-muted-foreground">Heart Rate</div>
                <div className="text-2xl font-bold">72 bpm</div>
                <div className="text-xs text-muted-foreground">Last checked: June 1, 2024</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs font-medium text-muted-foreground">Weight</div>
                <div className="text-2xl font-bold">185 lbs</div>
                <div className="text-xs text-muted-foreground">Last checked: May 25, 2024</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs font-medium text-muted-foreground">Blood Sugar</div>
                <div className="text-2xl font-bold">98 mg/dL</div>
                <div className="text-xs text-muted-foreground">Last checked: June 2, 2024</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ScheduleAppointmentForm open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen} />
    </div>
  )
}

