import { 
  ArrowDownIcon,
  ArrowUpIcon, 
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  description?: string
  className?: string
}

export function StatCard({
  title,
  value,
  icon,
  change,
  trend,
  description,
  className
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            {trend && trend !== 'neutral' && (
              trend === 'up' ? (
                <ArrowUpIcon className="mr-1 h-3 w-3 text-emerald-500" />
              ) : (
                <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
              )
            )}
            <span className={cn(
              trend === 'up' && "text-emerald-500",
              trend === 'down' && "text-red-500"
            )}>
              {change}
            </span>
            {description && <span className="ml-1">{description}</span>}
          </p>
        )}
        {!change && description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
