import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, FileText, MessageSquare, Pill } from "lucide-react"
import Link from "next/link"
import AppointmentCard from "@/components/appointment-card"
import NotificationList from "@/components/notification-list"
import HealthSummary from "@/components/health-summary"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
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
              <div className="mt-4">
                <Link href="/appointments">
                  <Button size="sm" variant="secondary" className="w-full">
                    View All Appointments
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
                    <Button variant="outline" size="sm">
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
                    <Button variant="outline" size="sm">
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
        <Tabs defaultValue="summary">
          <TabsList>
            <TabsTrigger value="summary">Health Summary</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="records">Recent Records</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="p-0 pt-4">
            <HealthSummary />
          </TabsContent>
          <TabsContent value="vitals" className="p-0 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Vital Statistics</CardTitle>
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
          </TabsContent>
          <TabsContent value="records" className="p-0 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Latest Medical Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Annual Physical Exam</p>
                      <p className="text-xs text-muted-foreground">May 15, 2024 - Dr. Robert Chen</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Blood Test Results</p>
                      <p className="text-xs text-muted-foreground">May 10, 2024 - Lab Report</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Vaccination Record</p>
                      <p className="text-xs text-muted-foreground">April 22, 2024 - Influenza</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

