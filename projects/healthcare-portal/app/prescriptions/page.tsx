import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, RefreshCw, MoreHorizontal, AlarmClock, Pill } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PrescriptionsPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">Prescriptions</h1>
          <p className="text-sm text-muted-foreground">View and manage your medications and request refills</p>
        </div>
      </header>
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">4</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Refills</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">1</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recently Filled</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">2</CardContent>
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
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="p-0 pt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-base">Lisinopril 10mg</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Request Refill</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Contact Doctor</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid gap-2">
                    <div className="flex items-center text-sm">
                      <Pill className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>1 tablet daily</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <AlarmClock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Take at 9:00 AM</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Refill available: 06/30/2024</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">
                        15 days remaining
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" size="sm">
                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    Request Refill
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-base">Metformin 500mg</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Request Refill</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Contact Doctor</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid gap-2">
                    <div className="flex items-center text-sm">
                      <Pill className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>2 tablets daily</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <AlarmClock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Take at 8:00 AM and 8:00 PM</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Refill available: 07/15/2024</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                        30 days remaining
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" size="sm">
                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    Request Refill
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-base">Atorvastatin 20mg</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Request Refill</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Contact Doctor</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid gap-2">
                    <div className="flex items-center text-sm">
                      <Pill className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>1 tablet daily</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <AlarmClock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Take at 8:00 PM</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Refill available: 07/05/2024</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                        25 days remaining
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" size="sm">
                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    Request Refill
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="refills" className="p-0 pt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-base">Aspirin 81mg</CardTitle>
                  <Badge>Processing</Badge>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid gap-2">
                    <div className="flex items-center text-sm">
                      <Pill className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>1 tablet daily</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Requested: June 5, 2024</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Expected: June 8, 2024</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" size="sm">
                    Check Status
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="history" className="p-0 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Medication History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2 border-b pb-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Metformin 500mg</p>
                        <p className="text-xs text-muted-foreground">60 tablets</p>
                      </div>
                      <Badge variant="outline">Filled</Badge>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Filled on: May 15, 2024</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 border-b pb-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Lisinopril 10mg</p>
                        <p className="text-xs text-muted-foreground">30 tablets</p>
                      </div>
                      <Badge variant="outline">Filled</Badge>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Filled on: May 2, 2024</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pb-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Atorvastatin 20mg</p>
                        <p className="text-xs text-muted-foreground">30 tablets</p>
                      </div>
                      <Badge variant="outline">Filled</Badge>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Filled on: April 28, 2024</span>
                    </div>
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

