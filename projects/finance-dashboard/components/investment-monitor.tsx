"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Plus, TrendingDown, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvestmentChart } from "@/components/charts/investment-chart"
import { InvestmentForm } from "@/components/forms/investment-form"
import { cn } from "@/lib/utils"
import { useFinance } from "@/lib/data-context"
import { BudgetChart } from "@/components/charts/budget-chart"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { InvestmentTable } from "@/components/tables/investment-table"
import { useIsMobile } from "@/hooks/use-mobile"

export function InvestmentMonitor() {
  const { investments, deleteInvestment } = useFinance()
  const { toast } = useToast()
  const [isAddingInvestment, setIsAddingInvestment] = useState(false)
  const [date, setDate] = useState<Date>()
  const [selectedType, setSelectedType] = useState("all")
  const [filteredInvestments, setFilteredInvestments] = useState(investments)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const [isRebalancing, setIsRebalancing] = useState(false)
  const isMobile = useIsMobile()

  // Apply filters whenever investments, date, or selectedType changes
  useEffect(() => {
    applyFilters()
    // Check if there are any active filters
    setHasActiveFilters(!!date || selectedType !== "all")
  }, [investments, date, selectedType])

  // Filter investments based on date and type
  const applyFilters = () => {
    let filtered = [...investments]

    if (date) {
      const selectedMonth = date.getMonth()
      const selectedYear = date.getFullYear()
      // In a real app, investments would have a date field to filter by
      // For now, we'll just simulate this filtering
      filtered = filtered.filter(() => true) // Placeholder for actual date filtering
    }

    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter((investment) => investment.type === selectedType)
    }

    setFilteredInvestments(filtered)
  }

  // Reset filters
  const resetFilters = () => {
    setDate(undefined)
    setSelectedType("all")
    setFilteredInvestments(investments)
    setHasActiveFilters(false)
  }

  // Calculate investment totals
  const totalValue = filteredInvestments.reduce((sum, investment) => sum + investment.value, 0)
  const stocksValue = filteredInvestments.filter((inv) => inv.type === "Stock").reduce((sum, inv) => sum + inv.value, 0)
  const cryptoValue = filteredInvestments
    .filter((inv) => inv.type === "Crypto")
    .reduce((sum, inv) => sum + inv.value, 0)
  const otherValue = filteredInvestments
    .filter((inv) => inv.type !== "Stock" && inv.type !== "Crypto")
    .reduce((sum, inv) => sum + inv.value, 0)

  // Handle investment actions
  const handleEdit = (id: string) => {
    setSelectedInvestment(id)
    setIsEditing(true)
  }

  const handleView = (id: string) => {
    setSelectedInvestment(id)
    setIsViewingDetails(true)
  }

  const handleDelete = (id: string) => {
    setSelectedInvestment(id)
    setIsDeleting(true)
  }

  const confirmDelete = () => {
    if (selectedInvestment) {
      deleteInvestment(selectedInvestment)
      toast({
        title: "Investment deleted",
        description: "The investment has been deleted successfully.",
        duration: 3000,
        action: (
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Action undone",
                description: "The investment has been restored.",
                duration: 3000,
              })
            }}
          >
            Undo
          </Button>
        ),
      })
      setIsDeleting(false)
      setSelectedInvestment(null)
    }
  }

  const handleRebalance = () => {
    setIsRebalancing(true)
    // Simulate rebalancing process
    setTimeout(() => {
      toast({
        title: "Portfolio Rebalanced",
        description: "Your investment portfolio has been rebalanced successfully.",
        duration: 3000,
      })
      setIsRebalancing(false)
    }, 1500)
  }

  // Get the details of the selected investment
  const investmentDetails = selectedInvestment ? investments.find((i) => i.id === selectedInvestment) : null

  // Get color for investment type
  const getInvestmentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Stock: "#3b82f6", // Blue
      ETF: "#8b5cf6", // Violet
      "Mutual Fund": "#a855f7", // Purple
      Bond: "#14b8a6", // Teal
      Crypto: "#f59e0b", // Amber
      "Real Estate": "#84cc16", // Lime
      Commodity: "#eab308", // Yellow
      Other: "#64748b", // Slate
    }
    return colors[type] || "#3b82f6"
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Investment Monitor</h1>
        <p className="text-muted-foreground">Track and manage your investment portfolio</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-3 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[240px] justify-start text-left font-normal h-10",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM yyyy") : "Select period"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 text-center text-sm font-medium">
                  {date ? format(date, "MMMM yyyy") : "Select month"}
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 12 }, (_, i) => {
                      const monthDate = new Date()
                      monthDate.setMonth(i)
                      return (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-9 w-full",
                            date && date.getMonth() === i ? "bg-primary text-primary-foreground" : "",
                          )}
                          onClick={() => {
                            const newDate = new Date()
                            newDate.setMonth(i)
                            setDate(newDate)
                          }}
                        >
                          {format(monthDate, "MMM")}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[180px] h-10">
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
            {hasActiveFilters && (
              <Button variant="ghost" className="w-full sm:w-auto h-10" onClick={resetFilters}>
                Reset
              </Button>
            )}
          </div>
          <Button onClick={() => setIsAddingInvestment(true)} className="w-full sm:w-auto h-10">
            <Plus className="mr-2 h-4 w-4" />
            Add Investment
          </Button>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="w-full sm:w-auto overflow-x-auto h-11">
            <TabsTrigger value="portfolio" className="h-9">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="performance" className="h-9">
              Performance
            </TabsTrigger>
            <TabsTrigger value="allocation" className="h-9">
              Allocation
            </TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Total Value</CardTitle>
                  <CardDescription>Current portfolio value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+5.2% ($420.00)</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Stocks</CardTitle>
                  <CardDescription>Equity investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stocksValue.toFixed(2)}</div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+3.8% ($178.00)</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Crypto</CardTitle>
                  <CardDescription>Digital assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${cryptoValue.toFixed(2)}</div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+12.5% ($233.00)</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Other</CardTitle>
                  <CardDescription>Bonds, commodities, etc.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${otherValue.toFixed(2)}</div>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">-0.6% ($9.00)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Investment Holdings</CardTitle>
                <CardDescription>Details of your investment portfolio</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <InvestmentTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Track the performance of your investments over time</CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-2 px-2 pb-2">
                <InvestmentChart />
              </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Your best performing investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredInvestments
                      .sort((a, b) => b.change - a.change)
                      .slice(0, 3)
                      .map((investment) => (
                        <div key={investment.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: getInvestmentTypeColor(investment.type) + "20" }}
                            >
                              <TrendingUp
                                className="h-5 w-5"
                                style={{ color: getInvestmentTypeColor(investment.type) }}
                              />
                            </div>
                            <div>
                              <div className="font-medium">{investment.name}</div>
                              <div className="text-sm text-muted-foreground">{investment.type}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${investment.value.toFixed(2)}</div>
                            <div className="text-sm text-green-500">+{investment.change}%</div>
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
                  <div className="space-y-6">
                    {filteredInvestments
                      .sort((a, b) => a.change - b.change)
                      .slice(0, 3)
                      .map((investment) => (
                        <div key={investment.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor:
                                  investment.change < 0
                                    ? "rgba(239, 68, 68, 0.1)"
                                    : getInvestmentTypeColor(investment.type) + "20",
                              }}
                            >
                              {investment.change < 0 ? (
                                <TrendingDown className="h-5 w-5 text-red-500" />
                              ) : (
                                <TrendingUp
                                  className="h-5 w-5"
                                  style={{ color: getInvestmentTypeColor(investment.type) }}
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{investment.name}</div>
                              <div className="text-sm text-muted-foreground">{investment.type}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${investment.value.toFixed(2)}</div>
                            <div className={investment.change >= 0 ? "text-sm text-green-500" : "text-sm text-red-500"}>
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
          <TabsContent value="allocation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>How your investments are distributed across asset classes</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center justify-center">
                    <div className="w-full max-w-xs h-[350px]">
                      <BudgetChart
                        budgets={Object.entries(
                          filteredInvestments.reduce(
                            (acc, inv) => {
                              acc[inv.type] = (acc[inv.type] || 0) + inv.value
                              return acc
                            },
                            {} as Record<string, number>,
                          ),
                        ).map(([type, value]) => ({
                          id: type,
                          category: type,
                          allocated: value,
                          spent: 0,
                          remaining: 0,
                          progress: 0,
                        }))}
                        height={350}
                      />
                    </div>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                    <h3 className="text-lg md:text-xl font-medium">Allocation Breakdown</h3>
                    <div className="space-y-2 md:space-y-4 overflow-y-auto max-h-[200px] md:max-h-none">
                      {Object.entries(
                        filteredInvestments.reduce(
                          (acc, inv) => {
                            acc[inv.type] = (acc[inv.type] || 0) + inv.value
                            return acc
                          },
                          {} as Record<string, number>,
                        ),
                      ).map(([type, value]) => {
                        const percentage = ((value / totalValue) * 100).toFixed(1)
                        return (
                          <div key={type} className="flex items-center justify-between py-1 md:py-2">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div
                                className="w-3 h-3 md:w-4 md:h-4 rounded-full"
                                style={{ backgroundColor: getInvestmentTypeColor(type) }}
                              ></div>
                              <span className="text-sm md:text-base truncate max-w-[100px] md:max-w-none">{type}</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                              <span className="text-sm md:text-base font-medium">${value.toFixed(0)}</span>
                              <span className="text-xs md:text-sm text-muted-foreground">({percentage}%)</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="pt-4 md:pt-6 border-t mt-4 md:mt-6">
                      <h3 className="text-lg md:text-xl font-medium mb-2 md:mb-4">Recommended Allocation</h3>
                      <div className="text-sm md:text-base text-muted-foreground">
                        <p>Based on your risk profile and goals, we recommend:</p>
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 mt-3 md:mt-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <span className="text-sm md:text-base">Stocks: 60%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-teal-500 flex-shrink-0"></div>
                            <span className="text-sm md:text-base">Bonds: 25%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0"></div>
                            <span className="text-sm md:text-base truncate">Alt. Investments: 10%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-500 flex-shrink-0"></div>
                            <span className="text-sm md:text-base">Cash: 5%</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        className="mt-4 md:mt-6 w-full sm:w-auto h-10"
                        variant="outline"
                        onClick={handleRebalance}
                        disabled={isRebalancing}
                      >
                        {isRebalancing ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Rebalancing...
                          </>
                        ) : (
                          "Rebalance Portfolio"
                        )}
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

      {isEditing && selectedInvestment && (
        <InvestmentForm
          investmentId={selectedInvestment}
          onClose={() => {
            setIsEditing(false)
            setSelectedInvestment(null)
          }}
        />
      )}

      {isViewingDetails && investmentDetails && (
        <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Investment Details</DialogTitle>
              <DialogDescription>Detailed information about this investment</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Name/Symbol:</div>
                <div className="col-span-3">{investmentDetails.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Type:</div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getInvestmentTypeColor(investmentDetails.type) }}
                    ></div>
                    {investmentDetails.type}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Shares/Units:</div>
                <div className="col-span-3">{investmentDetails.shares}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Price:</div>
                <div className="col-span-3">${investmentDetails.price.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Value:</div>
                <div className="col-span-3">${investmentDetails.value.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Change:</div>
                <div className="col-span-3">
                  <span className={investmentDetails.change > 0 ? "text-green-500" : "text-red-500"}>
                    {investmentDetails.change > 0 ? "+" : ""}
                    {investmentDetails.change}%
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the investment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

