"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface AppointmentCardProps {
  doctor: string
  specialty: string
  date: string
  time: string
  location?: string
  status?: "confirmed" | "pending" | "cancelled"
  isUpcoming?: boolean
  onCancel?: () => void
}

export default function AppointmentCard({
  doctor,
  specialty,
  date,
  time,
  location = "Main Hospital - Room 302",
  status = "confirmed",
  isUpcoming = false,
  onCancel,
}: AppointmentCardProps) {
  const { toast } = useToast()
  const [currentStatus, setCurrentStatus] = useState(status)

  const handleReschedule = () => {
    toast({
      title: "Reschedule Requested",
      description: `Your appointment with ${doctor} is being rescheduled. We'll contact you shortly.`,
    })
  }

  const handleCancel = () => {
    setCurrentStatus("cancelled")

    if (onCancel) {
      onCancel()
    } else {
      toast({
        title: "Appointment Cancelled",
        description: `Your appointment with ${doctor} on ${date} has been cancelled.`,
      })
    }
  }

  return (
    <Card
      className={cn(
        "border",
        isUpcoming && currentStatus === "confirmed" && "border-primary/20 bg-primary/5",
        currentStatus === "cancelled" && "border-destructive/20 bg-destructive/5",
      )}
    >
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{doctor}</h3>
            <p className="text-sm text-muted-foreground">{specialty}</p>
          </div>
          <Badge
            variant={
              currentStatus === "confirmed" ? "default" : currentStatus === "pending" ? "outline" : "destructive"
            }
          >
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </Badge>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{location}</span>
          </div>
        </div>
        {isUpcoming && currentStatus === "confirmed" && (
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={handleReschedule}>
              Reschedule
            </Button>
            <Button size="sm" variant="destructive" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

