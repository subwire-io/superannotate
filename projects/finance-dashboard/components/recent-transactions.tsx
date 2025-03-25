"use client"

import { CreditCard, DollarSign, Receipt, ShoppingCart, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFinance } from "@/lib/data-context"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { TransactionForm } from "@/components/forms/transaction-form"

export function RecentTransactions() {
  const { getRecentTransactions, isLoading } = useFinance()
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const transactions = getRecentTransactions()

  // Map category to icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Food":
        return ShoppingCart
      case "Dining":
      case "Dining Out":
        return Utensils
      case "Income":
        return DollarSign
      default:
        return CreditCard
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4" aria-live="polite" aria-busy={true}>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full mr-4" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
              <Skeleton className="h-4 w-[60px]" />
            </div>
          ))}
      </div>
    )
  }

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center" role="status">
        <Receipt className="h-12 w-12 text-muted-foreground mb-3" aria-hidden="true" />
        <h3 className="text-lg font-medium">No recent transactions</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Add your first transaction to start tracking your finances
        </p>
        <Button className="mt-3" size="sm" onClick={() => setIsAddingTransaction(true)}>
          Add Transaction
        </Button>

        {isAddingTransaction && <TransactionForm onClose={() => setIsAddingTransaction(false)} />}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const Icon = getCategoryIcon(transaction.category)
        return (
          <div key={transaction.id} className="flex items-center">
            <div className="mr-4 rounded-full p-2 bg-muted" aria-hidden="true">
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">
                {transaction.category} • {transaction.date}
              </p>
            </div>
            <div
              className={`font-medium ${transaction.amount > 0 ? "text-green-500" : ""}`}
              aria-label={`${Math.abs(transaction.amount).toFixed(2)} ${transaction.amount > 0 ? "income" : "expense"}`}
            >
              {transaction.amount > 0 ? "+" : ""}
              {Math.abs(transaction.amount).toFixed(2)}
            </div>
          </div>
        )
      })}

      {isAddingTransaction && <TransactionForm onClose={() => setIsAddingTransaction(false)} />}
    </div>
  )
}

