import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { HeartPulse, Activity, Droplets } from "lucide-react"

export default function HealthSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Allergies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">Penicillin</div>
            <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">Shellfish</div>
            <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">Pollen</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">Hypertension</div>
            <div className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">Type 2 Diabetes</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Lisinopril 10mg</div>
            <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Metformin 500mg</div>
            <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">Atorvastatin 20mg</div>
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Health Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Blood Pressure</span>
                </div>
                <span className="text-sm">120/80</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Activity</span>
                </div>
                <span className="text-sm">6,500 steps</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Water Intake</span>
                </div>
                <span className="text-sm">6/8 glasses</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

