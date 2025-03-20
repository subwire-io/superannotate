'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Download, FileDown } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const reportTypes = [
  {
    id: 'sales',
    label: 'Sales Report',
    description: 'Revenue, orders, and product performance'
  },
  {
    id: 'inventory',
    label: 'Inventory Report',
    description: 'Stock levels, reordering needs, and product turnover'
  },
  {
    id: 'customers',
    label: 'Customer Report',
    description: 'Customer acquisition, retention, and lifetime value'
  },
  {
    id: 'marketing',
    label: 'Marketing Report',
    description: 'Campaign performance, conversion rates, and ROI'
  }
]

const fileFormats = [
  { id: 'csv', label: 'CSV' },
  { id: 'xlsx', label: 'Excel (XLSX)' },
  { id: 'pdf', label: 'PDF' },
  { id: 'json', label: 'JSON' }
]

export function ExportReport() {
  const [reportType, setReportType] = useState('sales')
  const [fileFormat, setFileFormat] = useState('csv')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [includeSections, setIncludeSections] = useState<string[]>(['summary', 'charts', 'tables'])

  const handleSectionToggle = (section: string) => {
    if (includeSections.includes(section)) {
      setIncludeSections(includeSections.filter(s => s !== section))
    } else {
      setIncludeSections([...includeSections, section])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Report</CardTitle>
        <CardDescription>Generate and download custom reports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Type Selection */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Report Type</h3>
          <RadioGroup
            defaultValue={reportType}
            onValueChange={setReportType}
            className="grid gap-4 md:grid-cols-2"
          >
            {reportTypes.map((type) => (
              <div key={type.id}>
                <RadioGroupItem
                  value={type.id}
                  id={`report-type-${type.id}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`report-type-${type.id}`}
                  className="flex flex-col justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-muted-foreground">{type.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Date Range Selection */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Date Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-from"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    format(dateRange.from, "PPP")
                  ) : (
                    <span>Start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-to"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? (
                    format(dateRange.to, "PPP")
                  ) : (
                    <span>End date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Include Sections */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Include Sections</h3>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-summary" 
                checked={includeSections.includes('summary')}
                onCheckedChange={() => handleSectionToggle('summary')}
              />
              <Label htmlFor="include-summary">Summary</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-charts" 
                checked={includeSections.includes('charts')}
                onCheckedChange={() => handleSectionToggle('charts')}
              />
              <Label htmlFor="include-charts">Charts & Graphs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-tables" 
                checked={includeSections.includes('tables')}
                onCheckedChange={() => handleSectionToggle('tables')}
              />
              <Label htmlFor="include-tables">Detailed Tables</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-recommendations" 
                checked={includeSections.includes('recommendations')}
                onCheckedChange={() => handleSectionToggle('recommendations')}
              />
              <Label htmlFor="include-recommendations">Recommendations</Label>
            </div>
          </div>
        </div>

        {/* File Format Selection */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">File Format</h3>
          <Select
            defaultValue={fileFormat}
            onValueChange={setFileFormat}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {fileFormats.map((format) => (
                <SelectItem key={format.id} value={format.id}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Export Report
        </Button>
      </CardContent>
    </Card>
  )
}
