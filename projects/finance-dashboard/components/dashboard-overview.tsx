"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CreditCard, DollarSign, LineChart, Loader2, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ExpenseChart } from "@/components/charts/expense-chart"
import { BudgetChart } from "@/components/charts/budget-chart"
import { InvestmentChart } from "@/components/charts/investment-chart"
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { useFinance } from "@/lib/data-context"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardOverview() {
  const [activeTab, setActiveTab] = useState("overview")
  const { getTotalBalance, getMonthlyExpenses, getTotalInvestments, getGoalProgress, isLoading } = useFinance()

  return (
    <main className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your financial overview and summary</p>
      </header>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList aria-label="Dashboard sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <section aria-label="Financial summary cards" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-7 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">${getTotalBalance().toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-7 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">${getMonthlyExpenses().toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">-4.1% from last month</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investments</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-7 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">${getTotalInvestments().toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-7 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{getGoalProgress()}%</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </>
                )}
              </CardContent>
            </Card>
          </section>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Expense Overview</CardTitle>
                <CardDescription>Your monthly expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="sr-only">Loading expense chart</span>
                  </div>
                ) : (
                  <div className="w-full overflow-hidden">
                    <ExpenseChart />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3">
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
                    <span>View All Transactions</span>
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Budget Status</CardTitle>
                <CardDescription>Your budget progress for this month</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="sr-only">Loading budget chart</span>
                  </div>
                ) : (
                  <div className="w-full overflow-hidden">
                    <BudgetChart />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/budgets">
                    <span>Manage Budgets</span>
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Investment Performance</CardTitle>
                <CardDescription>Your investment portfolio growth</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="sr-only">Loading investment chart</span>
                  </div>
                ) : (
                  <div className="w-full overflow-hidden">
                    <InvestmentChart />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/investments">
                    <span>View Portfolio</span>
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed analysis of your financial data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Income vs. Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-[200px]">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="sr-only">Loading chart</span>
                      </div>
                    ) : (
                      <div className="h-[200px] w-full overflow-hidden">
                        <IncomeExpenseChart />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Spending Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-[200px]">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="sr-only">Loading chart</span>
                      </div>
                    ) : (
                      <div className="h-[200px] w-full overflow-hidden">
                        <InvestmentChart />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Financial Health Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-[200px]">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="sr-only">Loading financial health data</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4">
                        <div className="text-4xl font-bold text-green-500">82/100</div>
                        <p className="text-sm text-muted-foreground mt-2">Your financial health is good</p>
                        <div className="w-full mt-4 grid grid-cols-3 gap-2">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">Savings</span>
                            <span className="text-green-500">Good</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">Debt</span>
                            <span className="text-amber-500">Fair</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">Investments</span>
                            <span className="text-green-500">Excellent</span>
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

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate and view your financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-base">Monthly Summary</CardTitle>
                    <CardDescription>Overview of your monthly finances</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-base">Tax Report</CardTitle>
                    <CardDescription>Summary for tax filing purposes</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-base">Investment Performance</CardTitle>
                    <CardDescription>Detailed investment analysis</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-base">Budget Analysis</CardTitle>
                    <CardDescription>Review of your budget performance</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      Generate Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

