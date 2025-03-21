"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Search, FilePieChart, FileSpreadsheet, Download, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { MedicalRecordViewer } from "@/components/medical-record-viewer"

interface MedicalRecord {
  id: string
  title: string
  date: string
  type: "exam" | "lab" | "vaccination" | "imaging" | "prescription"
  provider: string
  description: string
  icon: typeof FileText | typeof FilePieChart | typeof FileSpreadsheet
  details?: string
}

export default function MedicalRecordsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const allRecords: MedicalRecord[] = [
    {
      id: "REC-2024-001",
      title: "Annual Physical Exam",
      date: "May 15, 2024",
      type: "exam",
      provider: "Dr. Robert Chen",
      description: "Comprehensive physical examination report",
      icon: FileText,
      details:
        "Patient presented for annual physical examination. Vitals were within normal limits.\n\nBlood Pressure: 120/80 mmHg\nHeart Rate: 72 bpm\nTemperature: 98.6°F\nRespiratory Rate: 16 breaths/min\n\nPhysical examination was unremarkable. Patient reports good compliance with medications and no new symptoms. Recommended continued monitoring of blood pressure and follow-up in 12 months.",
    },
    {
      id: "REC-2024-002",
      title: "Blood Test Results",
      date: "May 10, 2024",
      type: "lab",
      provider: "Quest Diagnostics",
      description: "Comprehensive blood panel including CBC, lipid panel, and A1C",
      icon: FilePieChart,
      details:
        "Complete Blood Count (CBC):\n- WBC: 7.2 x10^3/uL (Normal: 4.5-11.0)\n- RBC: 4.8 x10^6/uL (Normal: 4.5-5.9)\n- Hemoglobin: 14.2 g/dL (Normal: 13.5-17.5)\n- Hematocrit: 42% (Normal: 41-50%)\n- Platelets: 250 x10^3/uL (Normal: 150-450)\n\nLipid Panel:\n- Total Cholesterol: 185 mg/dL (Desirable: <200)\n- HDL: 55 mg/dL (Desirable: >40)\n- LDL: 110 mg/dL (Desirable: <100)\n- Triglycerides: 120 mg/dL (Normal: <150)\n\nHemoglobin A1C: 5.6% (Normal: <5.7%)",
    },
    {
      id: "REC-2024-003",
      title: "Vaccination Record",
      date: "April 22, 2024",
      type: "vaccination",
      provider: "Nurse Williams",
      description: "Influenza vaccination administered",
      icon: FileSpreadsheet,
      details:
        "Patient received seasonal influenza vaccine (Fluzone Quadrivalent).\nLot Number: D8043-1\nExpiration Date: 06/30/2024\nInjection Site: Left deltoid\nRoute: Intramuscular\nDose: 0.5 mL\n\nPatient tolerated the procedure well with no immediate adverse reactions. Patient was advised to monitor for any delayed reactions and report them promptly.",
    },
    {
      id: "REC-2024-004",
      title: "Chest X-Ray",
      date: "March 5, 2024",
      type: "imaging",
      provider: "Dr. Lisa Wong",
      description: "Routine chest X-ray for annual checkup",
      icon: FileText,
      details:
        "Chest X-ray was performed in PA and lateral views.\n\nFindings: Lungs are clear bilaterally with no evidence of infiltrates, effusions, or pneumothorax. Heart size is normal. Mediastinal contours are unremarkable. No pleural abnormalities. Osseous structures show no acute abnormalities.\n\nImpression: Normal chest X-ray with no acute cardiopulmonary process identified.",
    },
    {
      id: "REC-2024-005",
      title: "Cholesterol Panel",
      date: "February 18, 2024",
      type: "lab",
      provider: "LabCorp",
      description: "Lipid profile and cholesterol levels",
      icon: FilePieChart,
      details:
        "Lipid Panel Results:\n- Total Cholesterol: 190 mg/dL (Desirable: <200)\n- HDL Cholesterol: 52 mg/dL (Desirable: >40)\n- LDL Cholesterol: 118 mg/dL (Desirable: <100)\n- Triglycerides: 130 mg/dL (Normal: <150)\n- Total Cholesterol/HDL Ratio: 3.7 (Desirable: <5.0)\n\nAssessment: Borderline elevated LDL cholesterol. Recommend lifestyle modifications including diet and exercise. Consider follow-up testing in 6 months.",
    },
    {
      id: "REC-2024-006",
      title: "Prescription History",
      date: "January 30, 2024",
      type: "prescription",
      provider: "Dr. Sarah Johnson",
      description: "Complete medication history and current prescriptions",
      icon: FileSpreadsheet,
      details:
        "Current Medications:\n\n1. Lisinopril 10mg\n   - 1 tablet daily\n   - For hypertension\n   - First prescribed: 06/15/2023\n   - Last refill: 01/15/2024\n\n2. Metformin 500mg\n   - 2 tablets daily (morning and evening)\n   - For Type 2 Diabetes\n   - First prescribed: 05/10/2023\n   - Last refill: 01/10/2024\n\n3. Atorvastatin 20mg\n   - 1 tablet daily (evening)\n   - For hyperlipidemia\n   - First prescribed: 07/22/2023\n   - Last refill: 01/22/2024",
    },
  ]

  // Filter records based on search query and active tab
  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
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
  }, [searchQuery, activeTab])

  const handleView = (record: MedicalRecord) => {
    setSelectedRecord(record)
    setIsViewerOpen(true)
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
      <header className="sticky top-0 z-30 flex h-14 lg:h-[60px] items-center border-b bg-background px-4 md:px-6">
        <div className="flex w-full items-center justify-between">
          <div className="ml-12 md:ml-0">
            <h1 className="text-lg font-semibold md:text-2xl">Medical Records</h1>
            <p className="text-sm text-muted-foreground">
              Access and manage your health information and medical history
            </p>
          </div>
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
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => handleView(record)}>
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

      <MedicalRecordViewer record={selectedRecord} open={isViewerOpen} onOpenChange={setIsViewerOpen} />
    </div>
  )
}

