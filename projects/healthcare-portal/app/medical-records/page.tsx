"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Search, FilePieChart, FileSpreadsheet, Download, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface MedicalRecord {
  id: string
  title: string
  date: string
  type: "exam" | "lab" | "vaccination" | "imaging" | "prescription"
  provider: string
  description: string
  icon: typeof FileText | typeof FilePieChart | typeof FileSpreadsheet
}

export default function MedicalRecordsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const allRecords: MedicalRecord[] = [
    {
      id: "rec-1",
      title: "Annual Physical Exam",
      date: "May 15, 2024",
      type: "exam",
      provider: "Dr. Robert Chen",
      description: "Comprehensive physical examination report",
      icon: FileText,
    },
    {
      id: "rec-2",
      title: "Blood Test Results",
      date: "May 10, 2024",
      type: "lab",
      provider: "Quest Diagnostics",
      description: "Comprehensive blood panel including CBC, lipid panel, and A1C",
      icon: FilePieChart,
    },
    {
      id: "rec-3",
      title: "Vaccination Record",
      date: "April 22, 2024",
      type: "vaccination",
      provider: "Nurse Williams",
      description: "Influenza vaccination administered",
      icon: FileSpreadsheet,
    },
    {
      id: "rec-4",
      title: "Chest X-Ray",
      date: "March 5, 2024",
      type: "imaging",
      provider: "Dr. Lisa Wong",
      description: "Routine chest X-ray for annual checkup",
      icon: FileText,
    },
    {
      id: "rec-5",
      title: "Cholesterol Panel",
      date: "February 18, 2024",
      type: "lab",
      provider: "LabCorp",
      description: "Lipid profile and cholesterol levels",
      icon: FilePieChart,
    },
    {
      id: "rec-6",
      title: "Prescription History",
      date: "January 30, 2024",
      type: "prescription",
      provider: "Dr. Sarah Johnson",
      description: "Complete medication history and current prescriptions",
      icon: FileSpreadsheet,
    },
  ]

  const [records, setRecords] = useState<MedicalRecord[]>(allRecords)

  // Filter records based on search query and active tab
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (
        (activeTab !== "all" && activeTab === "lab-results" && record.type !== "lab") ||
        (activeTab === "visits" && record.type !== "exam")
      ) {
        return false
      }

      if (!searchQuery) return true

      const query = searchQuery.toLowerCase()
      return (
        record.title.toLowerCase().includes(query) ||
        record.date.toLowerCase().includes(query) ||
        record.provider.toLowerCase().includes(query) ||
        record.description.toLowerCase().includes(query) ||
        record.type.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, activeTab, records])

  const handleView = (documentName: string) => {
    toast({
      title: "Viewing Document",
      description: `Opening ${documentName} in viewer...`,
    })
  }

  const handleDownload = (documentName: string) => {
    toast({
      title: "Download Started",
      description: `${documentName} is being downloaded to your device.`,
    })
  }

  return (
    <div className="flex flex-col">
      <Toaster />
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
            placeholder="Search records by title, date, provider, or type..."
            className="w-full bg-background pl-8 md:w-2/3 lg:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
            <TabsTrigger value="visits">Visit Notes</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="p-0 pt-6">
            {filteredRecords.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRecords.map((record) => {
                  const Icon = record.icon
                  return (
                    <Card key={record.id}>
                      <CardHeader className="flex flex-row items-start gap-4 pb-2 space-y-0">
                        <Icon className="h-5 w-5 text-primary" />
                        <div className="space-y-1">
                          <CardTitle className="text-base">{record.title}</CardTitle>
                          <CardDescription>{record.date}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {record.description} by {record.provider}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => handleView(record.title)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => handleDownload(record.title)}
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No records found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery
                    ? `No records match your search for "${searchQuery}"`
                    : "No records available in this category"}
                </p>
                {searchQuery && (
                  <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

