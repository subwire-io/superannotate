"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, RefreshCw, MoreHorizontal, AlarmClock, Pill, PlusCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Medication {
  id: number
  name: string
  dosage: string
  schedule: string
  refillDate: string
  daysRemaining: number
  status: "active" | "pending" | "refilled"
}

export default function PrescriptionsPage() {
  const { toast } = useToast()
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: "Lisinopril 10mg",
      dosage: "1 tablet daily",
      schedule: "Take at 9:00 AM",
      refillDate: "06/30/2024",
      daysRemaining: 15,
      status: "active",
    },
    {
      id: 2,
      name: "Metformin 500mg",
      dosage: "2 tablets daily",
      schedule: "Take at 8:00 AM and 8:00 PM",
      refillDate: "07/15/2024",
      daysRemaining: 30,
      status: "active",
    },
    {
      id: 3,
      name: "Atorvastatin 20mg",
      dosage: "1 tablet daily",
      schedule: "Take at 8:00 PM",
      refillDate: "07/05/2024",
      daysRemaining: 25,
      status: "active",
    },
    {
      id: 4,
      name: "Aspirin 81mg",
      dosage: "1 tablet daily",
      schedule: "Take at 9:00 AM",
      refillDate: "06/08/2024",
      daysRemaining: 3,
      status: "pending",
    },
  ])

  const handleRefillRequest = (id: number) => {
    setMedications(medications.map((med) => (med.id === id ? { ...med, status: "pending" } : med)))

    const medication = medications.find((med) => med.id === id)

    toast({
      title: "Refill Requested",
      description: `Your refill request for ${medication?.name} has been submitted.`,
    })
  }

  const handleViewDetails = (name: string) => {
    toast({
      title: "Medication Details",
      description: `Viewing detailed information for ${name}.`,
    })
  }

  const handleContactDoctor = (name: string) => {
    toast({
      title: "Contact Doctor",
      description: `Opening message form to discuss ${name} with your doctor.`,
    })
  }

  // Filter medications by status
  const activeMedications = medications.filter((med) => med.status === "active")
  const pendingMedications = medications.filter((med) => med.status === "pending")

  return (
    <div className="flex flex-col">
      <Toaster />
      <header className="sticky top-0 z-30 flex h-14 lg:h-[60px] items-center border-b bg-background px-4 md:px-6">
        <div className="flex w-full items-center justify-between">
          <div className="ml-12 md:ml-0">
            <h1 className="text-lg font-semibold md:text-2xl">Prescriptions</h1>
            <p className="text-sm text-muted-foreground">View and manage your medications and request refills</p>
          </div>
        </div>
      </header>
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{activeMedications.length}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Refills</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{pendingMedications.length}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pharmacy Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-500">Open Now</Badge>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="refills">Pending Refills</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="p-0 pt-6">
            {activeMedications.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeMedications.map((medication) => (
                  <Card key={medication.id}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-base">{medication.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(medication.name)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRefillRequest(medication.id)}>
                            Request Refill
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleContactDoctor(medication.name)}>
                            Contact Doctor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid gap-2">
                        <div className="flex items-center text-sm">
                          <Pill className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{medication.dosage}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <AlarmClock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{medication.schedule}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Refill available: {medication.refillDate}</span>
                        </div>
                        <div className="mt-2">
                          <Badge
                            variant="outline"
                            className={
                              medication.daysRemaining <= 7
                                ? "text-red-600 border-red-300 bg-red-50"
                                : medication.daysRemaining <= 15
                                  ? "text-yellow-600 border-yellow-300 bg-yellow-50"
                                  : "text-green-600 border-green-300 bg-green-50"
                            }
                          >
                            {medication.daysRemaining} days remaining
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        size="sm"
                        onClick={() => handleRefillRequest(medication.id)}
                      >
                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
                        Request Refill
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Pill className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No active medications</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  You don't have any active medications at the moment. If you need to add a medication, please contact
                  your healthcare provider.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 gap-2"
                  onClick={() => {
                    toast({
                      title: "Contact Doctor",
                      description: "Opening message form to discuss medications with your doctor.",
                    })
                  }}
                >
                  <PlusCircle className="h-4 w-4" />
                  Contact Doctor
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="refills" className="p-0 pt-6">
            {pendingMedications.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingMedications.map((medication) => (
                  <Card key={medication.id}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-base">{medication.name}</CardTitle>
                      <Badge>Processing</Badge>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid gap-2">
                        <div className="flex items-center text-sm">
                          <Pill className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{medication.dosage}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Requested: June 5, 2024</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Expected: June 8, 2024</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Refill Status",
                            description: `Your refill for ${medication.name} is being processed and will be ready for pickup on June 8.`,
                          })
                        }}
                      >
                        Check Status
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <RefreshCw className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No pending refills</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  You don't have any pending medication refills at the moment. You can request a refill from the Active
                  tab.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

