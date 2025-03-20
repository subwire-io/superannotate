'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { CustomerMetrics as CustomerMetricsType } from '@/types'
import { 
  Users, 
  UserPlus, 
  DollarSign,
  UserMinus
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { getPercentageChange, formatCurrency } from '@/lib/utils'

interface CustomerMetricsProps {
  metrics: CustomerMetricsType
}

// Sample data for visualization
const ageData = [
  { name: '18-24', value: 15 },
  { name: '25-34', value: 35 },
  { name: '35-44', value: 25 },
  { name: '45-54', value: 15 },
  { name: '55+', value: 10 },
]

const acquisitionData = [
  { month: 'Jan', organic: 45, paid: 28, referral: 17 },
  { month: 'Feb', organic: 42, paid: 30, referral: 18 },
  { month: 'Mar', organic: 48, paid: 32, referral: 20 },
  { month: 'Apr', organic: 50, paid: 34, referral: 22 },
  { month: 'May', organic: 55, paid: 36, referral: 25 },
  { month: 'Jun', organic: 60, paid: 38, referral: 30 },
]

const retentionData = [
  { month: 'Jan', rate: 78 },
  { month: 'Feb', rate: 75 },
  { month: 'Mar', rate: 80 },
  { month: 'Apr', rate: 82 },
  { month: 'May', rate: 85 },
  { month: 'Jun', rate: 87 },
]

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
  'hsl(var(--card))',
]

export function CustomerMetrics({ metrics }: CustomerMetricsProps) {
  const newCustomersTrend = metrics.newCustomers > metrics.previousNewCustomers ? 'up' : 'down'
  const activeCustomersTrend = metrics.activeCustomers > metrics.previousActiveCustomers ? 'up' : 'down'
  const churnRateTrend = metrics.churnRate < metrics.previousChurnRate ? 'up' : 'down'
  const cltTrend = metrics.customerLifetimeValue > metrics.previousCustomerLifetimeValue ? 'up' : 'down'

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Customers"
          value={metrics.activeCustomers.toString()}
          icon={<Users className="h-4 w-4" />}
          change={getPercentageChange(metrics.activeCustomers, metrics.previousActiveCustomers)}
          trend={activeCustomersTrend}
          description="vs last period"
        />
        <StatCard
          title="New Customers"
          value={metrics.newCustomers.toString()}
          icon={<UserPlus className="h-4 w-4" />}
          change={getPercentageChange(metrics.newCustomers, metrics.previousNewCustomers)}
          trend={newCustomersTrend}
          description="vs last period"
        />
        <StatCard
          title="Churn Rate"
          value={`${metrics.churnRate}%`}
          icon={<UserMinus className="h-4 w-4" />}
          change={`${Math.abs(metrics.churnRate - metrics.previousChurnRate).toFixed(1)}%`}
          trend={churnRateTrend}
          description="vs last period"
        />
        <StatCard
          title="Lifetime Value"
          value={formatCurrency(metrics.customerLifetimeValue)}
          icon={<DollarSign className="h-4 w-4" />}
          change={getPercentageChange(metrics.customerLifetimeValue, metrics.previousCustomerLifetimeValue)}
          trend={cltTrend}
          description="vs last period"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Acquisition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={acquisitionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="organic" fill="hsl(var(--primary))" name="Organic" />
                  <Bar dataKey="paid" fill="hsl(var(--secondary))" name="Paid" />
                  <Bar dataKey="referral" fill="hsl(var(--accent))" name="Referral" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Retention Rate %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="age">
            <TabsList className="mb-4">
              <TabsTrigger value="age">Age</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="device">Device</TabsTrigger>
            </TabsList>
            <TabsContent value="age" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="location" className="h-[300px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Location data visualization
              </div>
            </TabsContent>
            <TabsContent value="device" className="h-[300px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Device usage visualization
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
