"use client"

import { FileText, type FilePieChart, type FileSpreadsheet, Download, Calendar, User, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

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

interface MedicalRecordViewerProps {
  record: MedicalRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MedicalRecordViewer({ record, open, onOpenChange }: MedicalRecordViewerProps) {
  const { toast } = useToast()

  if (!record) return null

  const Icon = record.icon

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `${record.title} is being downloaded to your device.`,
    })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "exam":
        return "Examination"
      case "lab":
        return "Laboratory Test"
      case "vaccination":
        return "Vaccination"
      case "imaging":
        return "Imaging"
      case "prescription":
        return "Prescription"
      default:
        return type
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">{record.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{getTypeLabel(record.type)}</Badge>
                <span className="text-sm text-muted-foreground">ID: {record.id}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Date: {record.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Provider: {record.provider}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm">{record.description}</p>
          </div>

          {record.details && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-2">Details</h3>
                <div className="text-sm whitespace-pre-line bg-muted p-4 rounded-md">{record.details}</div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Last Updated: {record.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Format: PDF</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

