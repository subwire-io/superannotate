import { Mail, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Employee {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  avatar: string
}

export function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-muted p-6 flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={employee.avatar} alt={employee.name} />
            <AvatarFallback>
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-medium text-lg text-center">{employee.name}</h3>
          <p className="text-sm text-muted-foreground text-center">{employee.position}</p>
          <Badge variant="outline" className="mt-2">
            {employee.department}
          </Badge>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate">{employee.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">{employee.phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

