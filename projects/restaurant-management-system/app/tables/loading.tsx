import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"

export default function TablesLoading() {
  return (
    <div className="flex flex-col gap-4 max-w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6">
        <div className="py-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">Tables & Reservations</h1>
          <p className="text-muted-foreground">Manage restaurant tables and reservations</p>
        </div>
      </div>

      <Tabs defaultValue="tables" className="space-y-4">
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
            <Skeleton className="w-full sm:w-[180px] h-10" />
            <Button disabled>Add Table</Button>
          </div>

          <div className="grid gap-4 grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="border-l-4 hover:shadow-md transition-all h-full">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-8 w-[120px]" />
                  </div>
                  <CardDescription className="break-words">
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm">
                      <Skeleton className="h-4 w-24 mb-2" />
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div>
                <CardTitle>Reservations Calendar</CardTitle>
                <CardDescription>Manage and view all reservations</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <Skeleton className="w-[160px] h-9" />
                </div>
                <Button variant="outline" size="icon" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <Skeleton className="w-full sm:w-1/3 h-10" />
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Skeleton className="w-full sm:w-[180px] h-10" />
                  <Skeleton className="w-full sm:w-[150px] h-10" />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Skeleton className="h-4 w-[25%]" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-[15%]" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-[10%]" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-[10%]" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-[20%]" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-[20%] ml-auto" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-3 w-[150px]" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-[120px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-full ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

