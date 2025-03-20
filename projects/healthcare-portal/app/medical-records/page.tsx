import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Search, FilePieChart, FileImage, FileSpreadsheet, Download, Eye } from "lucide-react"

export default function MedicalRecordsPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">Medical Records</h1>
          <p className="text-sm text-muted-foreground">Access and manage your health information and medical history</p>
        </div>
      </header>
      <div className="flex-1 space-y-6 p-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search records by type, date, or provider..."
            className="w-full bg-background pl-8 md:w-2/3 lg:w-1/3"
          />
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
            <TabsTrigger value="visits">Visit Notes</TabsTrigger>
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
            <TabsTrigger value="vaccines">Vaccinations</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="p-0 pt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-start gap-4 pb-2 space-y-0">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="space-y-1">
                    <CardTitle className="text-base">Annual Physical Exam</CardTitle>
                    <CardDescription>May 15, 2024</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive physical examination report by Dr. Robert Chen
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-start gap-4 pb-2 space-y-0">
                  <FilePieChart className="h-5 w-5 text-primary" />
                  <div className="space-y-1">
                    <CardTitle className="text-base">Blood Test Results</CardTitle>
                    <CardDescription>May 10, 2024</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive blood panel including CBC, lipid panel, and A1C
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-start gap-4 pb-2 space-y-0">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <div className="space-y-1">
                    <CardTitle className="text-base">Vaccination Record</CardTitle>
                    <CardDescription>April 22, 2024</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Influenza vaccination administered by Nurse Williams
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-start gap-4 pb-2 space-y-0">
                  <FileImage className="h-5 w-5 text-primary" />
                  <div className="space-y-1">
                    <CardTitle className="text-base">Chest X-Ray</CardTitle>
                    <CardDescription>March 5, 2024</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Routine chest X-ray with radiologist interpretation
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="lab-results" className="p-0 pt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-start gap-4 pb-2 space-y-0">
                  <FilePieChart className="h-5 w-5 text-primary" />
                  <div className="space-y-1">
                    <CardTitle className="text-base">Blood Test Results</CardTitle>
                    <CardDescription>May 10, 2024</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive blood panel including CBC, lipid panel, and A1C
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="visits" className="p-0 pt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-start gap-4 pb-2 space-y-0">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="space-y-1">
                    <CardTitle className="text-base">Annual Physical Exam</CardTitle>
                    <CardDescription>May 15, 2024</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive physical examination report by Dr. Robert Chen
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

