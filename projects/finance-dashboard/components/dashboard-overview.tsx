"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CreditCard, DollarSign, LineChart, Loader2, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ExpenseChart } from "@/components/charts/expense-chart"
import { BudgetChart } from "@/components/charts/budget-chart"
import { InvestmentChart } from "@/components/charts/investment-chart"
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { useFinance } from "@/lib/data-context"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
// import { ReportCard } from "@/components/report-card"

export function DashboardOverview() {
  const [activeTab, setActiveTab] = useState("overview")
  const { getTotalBalance, getMonthlyExpenses, getTotalInvestments, getGoalProgress, isLoading, expenses, budgets } =
    useFinance()
  const { toast } = useToast()
  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your financial overview and summary</p>
      </header>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList
          aria-label="Dashboard sections"
          className="h-11 w-full overflow-x-auto sm:w-auto grid grid-cols-2 sm:flex"
        >
          <TabsTrigger value="overview" className="h-9">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="h-9">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <section aria-label="Financial summary cards" className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-7 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">${getTotalBalance().toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground mt-1">+2.5% from last month</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-7 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">${getMonthlyExpenses().toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground mt-1">-4.1% from last month</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Investments</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-7 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">${getTotalInvestments().toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground mt-1">+5.2% from last month</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-7 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{getGoalProgress()}%</div>
                    <p className="text-sm text-muted-foreground mt-1">+12% from last month</p>
                  </>
                )}
              </CardContent>
            </Card>
          </section>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Overview</CardTitle>
                <CardDescription>Your monthly expenses by category</CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "p-4" : "p-0 pt-2 px-2 pb-2"}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="sr-only">Loading expense chart</span>
                  </div>
                ) : (
                  <div className="w-full">
                    <ExpenseChart expenses={expenses} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions />
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/expenses">
                    <span>View All Expenses</span>
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="overflow-visible">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle>Budget Status</CardTitle>
                <CardDescription>Your budget progress for this month</CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "p-4" : "p-0 pt-0 px-0 pb-0"}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px] sm:h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="sr-only">Loading budget chart</span>
                  </div>
                ) : (
                  <div className="w-full">
                    <BudgetChart budgets={budgets || []} height={400} />
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 sm:p-6">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/budgets">
                    <span>Manage Budgets</span>
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Performance</CardTitle>
                <CardDescription>Your investment portfolio growth</CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "p-4" : "p-0 pt-2 px-2 pb-2"}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="sr-only">Loading investment chart</span>
                  </div>
                ) : (
                  <div className="w-full">
                    <InvestmentChart />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/investments">
                    <span>View Investments</span>
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed analysis of your financial data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Income vs. Expenses</CardTitle>
                  </CardHeader>
                  <CardContent className={isMobile ? "p-0" : "h-[300px] p-0 pt-2 px-2 pb-2"}>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="sr-only">Loading chart</span>
                      </div>
                    ) : (
                      <div className="w-full">
                        <IncomeExpenseChart />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Spending Trends</CardTitle>
                  </CardHeader>
                  <CardContent className={isMobile ? "p-0" : "h-[300px] p-0 pt-2 px-2 pb-2"}>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="sr-only">Loading chart</span>
                      </div>
                    ) : (
                      <div className="w-full">
                        <InvestmentChart />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Financial Health Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="sr-only">Loading financial health data</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="text-6xl font-bold text-green-500 mb-4">82/100</div>
                        <p className="text-base text-muted-foreground mb-8">Your financial health is good</p>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-base font-medium mb-2">Savings</span>
                            <span className="text-green-500 text-lg">Good</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-base font-medium mb-2">Debt</span>
                            <span className="text-amber-500 text-lg">Fair</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-base font-medium mb-2">Investments</span>
                            <span className="text-green-500 text-lg">Excellent</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

