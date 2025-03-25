"use client"

import { useState } from "react"
import { CalendarIcon, Plus, TrendingDown, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvestmentChart } from "@/components/charts/investment-chart"
import { InvestmentTable } from "@/components/tables/investment-table"
import { InvestmentForm } from "@/components/forms/investment-form"
import { cn } from "@/lib/utils"
import { useFinance } from "@/lib/data-context"
import { BudgetChart } from "@/components/charts/budget-chart"

export function InvestmentMonitor() {
  const { investments } = useFinance()
  const [isAddingInvestment, setIsAddingInvestment] = useState(false)
  const [date, setDate] = useState<Date>()
  const [selectedType, setSelectedType] = useState<string>("all")

  // Calculate investment totals
  const totalValue = investments.reduce((sum, investment) => sum + investment.value, 0)
  const stocksValue = investments.filter((inv) => inv.type === "Stock").reduce((sum, inv) => sum + inv.value, 0)
  const cryptoValue = investments.filter((inv) => inv.type === "Crypto").reduce((sum, inv) => sum + inv.value, 0)
  const otherValue = investments
    .filter((inv) => inv.type !== "Stock" && inv.type !== "Crypto")
    .reduce((sum, inv) => sum + inv.value, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Investment Monitor</h1>
        <p className="text-muted-foreground">Track and manage your investment portfolio</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM yyyy") : "Select period"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Assets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="Stock">Stocks</SelectItem>
                <SelectItem value="ETF">ETFs</SelectItem>
                <SelectItem value="Mutual Fund">Mutual Funds</SelectItem>
                <SelectItem value="Bond">Bonds</SelectItem>
                <SelectItem value="Crypto">Cryptocurrency</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Commodity">Commodities</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsAddingInvestment(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Investment
          </Button>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-4">
          <TabsList>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Value</CardTitle>
                  <CardDescription>Current portfolio value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500">+5.2% ($420.00)</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Stocks</CardTitle>
                  <CardDescription>Equity investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stocksValue.toFixed(2)}</div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500">+3.8% ($178.00)</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Crypto</CardTitle>
                  <CardDescription>Digital assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${cryptoValue.toFixed(2)}</div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500">+12.5% ($233.00)</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Other</CardTitle>
                  <CardDescription>Bonds, commodities, etc.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${otherValue.toFixed(2)}</div>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500">-0.6% ($9.00)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Investment Holdings</CardTitle>
                <CardDescription>Details of your investment portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <InvestmentTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Track the performance of your investments over time</CardDescription>
              </CardHeader>
              <CardContent>
                <InvestmentChart />
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Your best performing investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {investments
                      .sort((a, b) => b.change - a.change)
                      .slice(0, 3)
                      .map((investment) => (
                        <div key={investment.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{investment.name}</div>
                              <div className="text-xs text-muted-foreground">{investment.type}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${investment.value.toFixed(2)}</div>
                            <div className="text-xs text-green-500">+{investment.change}%</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Underperformers</CardTitle>
                  <CardDescription>Investments that need attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {investments
                      .sort((a, b) => a.change - b.change)
                      .slice(0, 3)
                      .map((investment) => (
                        <div key={investment.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                              <TrendingDown className="h-4 w-4 text-destructive" />
                            </div>
                            <div>
                              <div className="font-medium">{investment.name}</div>
                              <div className="text-xs text-muted-foreground">{investment.type}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${investment.value.toFixed(2)}</div>
                            <div className={investment.change >= 0 ? "text-xs text-green-500" : "text-xs text-red-500"}>
                              {investment.change >= 0 ? "+" : ""}
                              {investment.change}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="allocation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>How your investments are distributed across asset classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center justify-center">
                    <BudgetChart />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Allocation Breakdown</h3>
                    <div className="space-y-2">
                      {Object.entries(
                        investments.reduce(
                          (acc, inv) => {
                            acc[inv.type] = (acc[inv.type] || 0) + inv.value
                            return acc
                          },
                          {} as Record<string, number>,
                        ),
                      ).map(([type, value]) => {
                        const percentage = ((value / totalValue) * 100).toFixed(1)
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getCategoryColor(type) }}
                              ></div>
                              <span>{type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>${value.toFixed(2)}</span>
                              <span className="text-muted-foreground">({percentage}%)</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-2">Recommended Allocation</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>Based on your risk profile and goals, we recommend:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Stocks: 60%</li>
                          <li>Bonds: 25%</li>
                          <li>Alternative Investments: 10%</li>
                          <li>Cash: 5%</li>
                        </ul>
                      </div>
                      <Button className="mt-4" variant="outline">
                        Rebalance Portfolio
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {isAddingInvestment && <InvestmentForm onClose={() => setIsAddingInvestment(false)} />}
    </div>
  )
}

// Helper function to get color for investment type
function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    Stock: "hsl(var(--primary))",
    ETF: "hsl(var(--destructive))",
    "Mutual Fund": "hsl(var(--warning))",
    Bond: "hsl(var(--secondary))",
    Crypto: "hsl(var(--accent))",
    "Real Estate": "hsl(var(--muted))",
    Commodity: "hsl(var(--success))",
    Other: "hsl(var(--popover))",
  }

  return colors[category] || "hsl(var(--primary))"
}

