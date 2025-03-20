import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from "lucide-react"
import AppointmentCard from "@/components/appointment-card"

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">Appointments</h1>
          <p className="text-sm text-muted-foreground">Schedule, view, and manage your healthcare appointments</p>
        </div>
        <Button className="ml-auto gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>New Appointment</span>
        </Button>
      </header>
      <div className="flex-1 space-y-6 p-6">
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="p-0 pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AppointmentCard
                doctor="Dr. Sarah Johnson"
                specialty="Cardiology"
                date="June 15, 2024"
                time="10:00 AM"
                status="confirmed"
                isUpcoming={true}
              />
              <AppointmentCard
                doctor="Dr. Michael Chen"
                specialty="Endocrinology"
                date="June 22, 2024"
                time="2:30 PM"
                status="confirmed"
                isUpcoming={true}
              />
              <AppointmentCard
                doctor="Dr. Emily Wilson"
                specialty="Dermatology"
                date="July 5, 2024"
                time="9:15 AM"
                status="pending"
                isUpcoming={true}
              />
            </div>
          </TabsContent>
          <TabsContent value="past" className="p-0 pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AppointmentCard
                doctor="Dr. James Smith"
                specialty="Primary Care"
                date="May 10, 2024"
                time="11:30 AM"
                status="confirmed"
              />
              <AppointmentCard
                doctor="Dr. Patricia Lee"
                specialty="Ophthalmology"
                date="April 23, 2024"
                time="3:45 PM"
                status="confirmed"
              />
              <AppointmentCard
                doctor="Dr. Robert Miller"
                specialty="Orthopedics"
                date="March 17, 2024"
                time="1:00 PM"
                status="cancelled"
              />
            </div>
          </TabsContent>
          <TabsContent value="calendar" className="p-0 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" className="rounded-md border" />
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Upcoming on Selected Date</h3>
                  <div className="text-sm text-muted-foreground">Select a date with appointments to view details</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

