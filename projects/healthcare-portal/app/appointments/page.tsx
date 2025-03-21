"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Calendar } from "lucide-react"
import AppointmentCard from "@/components/appointment-card"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ScheduleAppointmentForm } from "@/components/schedule-appointment-form"

interface Appointment {
  id: number
  doctor: string
  specialty: string
  date: string
  time: string
  location: string
  status: "confirmed" | "pending" | "cancelled"
  isUpcoming: boolean
}

export default function AppointmentsPage() {
  const { toast } = useToast()
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "June 15, 2024",
      time: "10:00 AM",
      location: "Main Hospital - Room 302",
      status: "confirmed",
      isUpcoming: true,
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Endocrinology",
      date: "June 22, 2024",
      time: "2:30 PM",
      location: "Medical Center - Suite 105",
      status: "confirmed",
      isUpcoming: true,
    },
    {
      id: 3,
      doctor: "Dr. Emily Wilson",
      specialty: "Dermatology",
      date: "July 5, 2024",
      time: "9:15 AM",
      location: "Dermatology Clinic - Room 4",
      status: "pending",
      isUpcoming: true,
    },
    {
      id: 4,
      doctor: "Dr. James Smith",
      specialty: "Primary Care",
      date: "May 10, 2024",
      time: "11:30 AM",
      location: "Family Practice - Room 8",
      status: "confirmed",
      isUpcoming: false,
    },
    {
      id: 5,
      doctor: "Dr. Patricia Lee",
      specialty: "Ophthalmology",
      date: "April 23, 2024",
      time: "3:45 PM",
      location: "Eye Center - Suite 210",
      status: "confirmed",
      isUpcoming: false,
    },
    {
      id: 6,
      doctor: "Dr. Robert Miller",
      specialty: "Orthopedics",
      date: "March 17, 2024",
      time: "1:00 PM",
      location: "Orthopedic Center - Room 5",
      status: "cancelled",
      isUpcoming: false,
    },
    {
      id: 7,
      doctor: "Dr. Lisa Wong",
      specialty: "Neurology",
      date: "June 30, 2024",
      time: "11:00 AM",
      location: "Neurology Center - Room 12",
      status: "cancelled",
      isUpcoming: true,
    },
  ])

  // Filter appointments by status and whether they're upcoming
  const upcomingAppointments = appointments.filter((app) => app.isUpcoming && app.status !== "cancelled")

  const pastAppointments = appointments.filter((app) => !app.isUpcoming && app.status !== "cancelled")

  const cancelledAppointments = appointments.filter((app) => app.status === "cancelled")

  const handleCancelAppointment = (id: number) => {
    setAppointments(appointments.map((app) => (app.id === id ? { ...app, status: "cancelled" } : app)))

    const appointment = appointments.find((app) => app.id === id)

    if (appointment) {
      toast({
        title: "Appointment Cancelled",
        description: `Your appointment with ${appointment.doctor} on ${appointment.date} has been cancelled.`,
      })
    }
  }

  return (
    <div className="flex flex-col">
      <Toaster />
      <header className="sticky top-0 z-30 flex h-14 lg:h-[60px] items-center border-b bg-background px-4 md:px-6">
        <div className="flex w-full items-center justify-between">
          <div className="ml-12 md:ml-0">
            <h1 className="text-lg font-semibold md:text-2xl">Appointments</h1>
            <p className="text-sm text-muted-foreground">Schedule, view, and manage your healthcare appointments</p>
          </div>
          <Button className="ml-auto gap-1" onClick={() => setIsScheduleModalOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">New Appointment</span>
          </Button>
        </div>
      </header>
      <div className="flex-1 space-y-6 p-6">
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="p-0 pt-6">
            {upcomingAppointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    doctor={appointment.doctor}
                    specialty={appointment.specialty}
                    date={appointment.date}
                    time={appointment.time}
                    location={appointment.location}
                    status={appointment.status}
                    isUpcoming={true}
                    onCancel={() => handleCancelAppointment(appointment.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No upcoming appointments</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  You don't have any upcoming appointments scheduled. Click the "New Appointment" button to schedule
                  one.
                </p>
                <Button className="mt-4 gap-2" onClick={() => setIsScheduleModalOpen(true)}>
                  <PlusCircle className="h-4 w-4" />
                  Schedule Appointment
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="past" className="p-0 pt-6">
            {pastAppointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    doctor={appointment.doctor}
                    specialty={appointment.specialty}
                    date={appointment.date}
                    time={appointment.time}
                    location={appointment.location}
                    status={appointment.status}
                    isUpcoming={false}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No past appointments</h3>
                <p className="text-sm text-muted-foreground mt-1">You don't have any past appointment records.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="cancelled" className="p-0 pt-6">
            {cancelledAppointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cancelledAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    doctor={appointment.doctor}
                    specialty={appointment.specialty}
                    date={appointment.date}
                    time={appointment.time}
                    location={appointment.location}
                    status="cancelled"
                    isUpcoming={appointment.isUpcoming}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No cancelled appointments</h3>
                <p className="text-sm text-muted-foreground mt-1">You don't have any cancelled appointments.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ScheduleAppointmentForm open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen} />
    </div>
  )
}

