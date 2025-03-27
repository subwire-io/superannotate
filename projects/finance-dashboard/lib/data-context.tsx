"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

// Define types for our data
export type Expense = {
  id: string
  date: string
  description: string
  category: string
  amount: number
}

export type Budget = {
  id: string
  category: string
  allocated: number
  spent: number
  remaining: number
  progress: number
}

export type Investment = {
  id: string
  name: string
  type: string
  shares: number
  price: number
  value: number
  change: number
}

export type Goal = {
  id: string
  name: string
  type: string
  target: number
  current: number
  deadline: string
  progress: number
}

export type Transaction = {
  id: string
  description: string
  amount: number
  date: string
  icon: any
  category: string
}

// Initial data
const initialExpenses: Expense[] = [
  {
    id: "exp1",
    date: "2023-08-15",
    description: "Grocery Shopping",
    category: "Food",
    amount: 120.5,
  },
  {
    id: "exp2",
    date: "2023-08-14",
    description: "Gas Station",
    category: "Transportation",
    amount: 45.0,
  },
  {
    id: "exp3",
    date: "2023-08-12",
    description: "Internet Bill",
    category: "Utilities",
    amount: 79.99,
  },
  {
    id: "exp4",
    date: "2023-08-10",
    description: "Restaurant Dinner",
    category: "Dining Out",
    amount: 65.3,
  },
  {
    id: "exp5",
    date: "2023-08-05",
    description: "Movie Tickets",
    category: "Entertainment",
    amount: 24.0,
  },
]

const initialBudgets: Budget[] = [
  {
    id: "b1",
    category: "Housing",
    allocated: 1200,
    spent: 1200,
    remaining: 0,
    progress: 100,
  },
  {
    id: "b2",
    category: "Food",
    allocated: 500,
    spent: 450,
    remaining: 50,
    progress: 90,
  },
  {
    id: "b3",
    category: "Transportation",
    allocated: 300,
    spent: 250,
    remaining: 50,
    progress: 83,
  },
  {
    id: "b4",
    category: "Utilities",
    allocated: 200,
    spent: 180,
    remaining: 20,
    progress: 90,
  },
  {
    id: "b5",
    category: "Entertainment",
    allocated: 150,
    spent: 120,
    remaining: 30,
    progress: 80,
  },
]

const initialInvestments: Investment[] = [
  {
    id: "inv1",
    name: "AAPL",
    type: "Stock",
    shares: 10,
    price: 175.5,
    value: 1755.0,
    change: 3.2,
  },
  {
    id: "inv2",
    name: "MSFT",
    type: "Stock",
    shares: 5,
    price: 320.2,
    value: 1601.0,
    change: 1.5,
  },
  {
    id: "inv3",
    name: "BTC",
    type: "Crypto",
    shares: 0.05,
    price: 42000.0,
    value: 2100.0,
    change: 12.5,
  },
  {
    id: "inv4",
    name: "VTSAX",
    type: "Fund",
    shares: 20,
    price: 94.7,
    value: 1894.0,
    change: 0.8,
  },
  {
    id: "inv5",
    name: "BOND-ETF",
    type: "Bond",
    shares: 15,
    price: 100.0,
    value: 1500.0,
    change: -0.6,
  },
]

const initialGoals: Goal[] = [
  {
    id: "g1",
    name: "Emergency Fund",
    type: "Savings",
    target: 10000,
    current: 6000,
    deadline: "2023-12-31",
    progress: 60,
  },
  {
    id: "g2",
    name: "New Car",
    type: "Major Purchase",
    target: 25000,
    current: 12000,
    deadline: "2024-06-30",
    progress: 48,
  },
  {
    id: "g3",
    name: "Student Loan",
    type: "Debt Repayment",
    target: 30000,
    current: 15000,
    deadline: "2025-12-31",
    progress: 50,
  },
  {
    id: "g4",
    name: "Home Down Payment",
    type: "Savings",
    target: 60000,
    current: 20000,
    deadline: "2026-01-01",
    progress: 33,
  },
  {
    id: "g5",
    name: "Vacation Fund",
    type: "Savings",
    target: 5000,
    current: 2500,
    deadline: "2023-10-15",
    progress: 50,
  },
]

// Create the context
type FinanceContextType = {
  expenses: Expense[]
  budgets: Budget[]
  investments: Investment[]
  goals: Goal[]
  isLoading: boolean
  addExpense: (expense: Omit<Expense, "id">) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
  addBudget: (budget: Omit<Budget, "id" | "spent" | "remaining" | "progress">) => void
  updateBudget: (budget: Budget) => void
  deleteBudget: (id: string) => void
  addInvestment: (investment: Omit<Investment, "id" | "value" | "change">) => void
  updateInvestment: (investment: Investment) => void
  deleteInvestment: (id: string) => void
  addGoal: (goal: Omit<Goal, "id" | "progress">) => void
  updateGoal: (goal: Goal) => void
  deleteGoal: (id: string) => void
  getRecentTransactions: () => Transaction[]
  getTotalBalance: () => number
  getMonthlyExpenses: () => number
  getTotalInvestments: () => number
  getGoalProgress: () => number
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

// Provider component
export function FinanceProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletedItems, setDeletedItems] = useState<{ id: string; type: string; item: any }[]>([])

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setExpenses(initialExpenses)
      setBudgets(initialBudgets)
      setInvestments(initialInvestments)
      setGoals(initialGoals)
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Update budget spent amounts based on expenses
  useEffect(() => {
    if (!isLoading) {
      // Group expenses by category
      const expensesByCategory: Record<string, number> = {}
      expenses.forEach((expense) => {
        if (expensesByCategory[expense.category]) {
          expensesByCategory[expense.category] += expense.amount
        } else {
          expensesByCategory[expense.category] = expense.amount
        }
      })

      // Update budgets with actual spent amounts
      const updatedBudgets = budgets.map((budget) => {
        const spent = expensesByCategory[budget.category] || 0
        const remaining = budget.allocated - spent
        const progress = Math.min(100, Math.round((spent / budget.allocated) * 100))

        return {
          ...budget,
          spent,
          remaining,
          progress,
        }
      })

      setBudgets(updatedBudgets)
    }
  }, [expenses, isLoading])

  // Expense functions
  const addExpense = (expense: Omit<Expense, "id">) => {
    // Check if this is an undo operation (item exists in deletedItems)
    const deletedItem = deletedItems.find(
      (item) =>
        item.type === "expense" &&
        item.item.date === expense.date &&
        item.item.description === expense.description &&
        item.item.category === expense.category &&
        item.item.amount === expense.amount,
    )

    if (deletedItem) {
      // This is an undo operation, restore the original item with its ID
      setExpenses((prev) => [...prev, deletedItem.item as Expense])
      // Remove from deletedItems
      setDeletedItems((prev) => prev.filter((item) => item.id !== deletedItem.id))
    } else {
      // This is a new expense
      const newExpense = {
        ...expense,
        id: `exp${Date.now()}`,
      }
      setExpenses([newExpense, ...expenses])
    }
  }

  const updateExpense = (expense: Expense) => {
    const oldExpense = expenses.find((e) => e.id === expense.id)
    setExpenses(expenses.map((e) => (e.id === expense.id ? expense : e)))
  }

  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find((e) => e.id === id)
    if (expenseToDelete) {
      // Store the deleted item for potential undo
      setDeletedItems((prev) => [
        ...prev,
        {
          id: id,
          type: "expense",
          item: expenseToDelete,
        },
      ])

      // Remove from expenses
      setExpenses(expenses.filter((e) => e.id !== id))
    }
  }

  // Budget functions
  const addBudget = (budget: Omit<Budget, "id" | "spent" | "remaining" | "progress">) => {
    // Check if this is an undo operation
    const deletedItem = deletedItems.find(
      (item) =>
        item.type === "budget" && item.item.category === budget.category && item.item.allocated === budget.allocated,
    )

    if (deletedItem) {
      // This is an undo operation, restore the original item with its ID
      setBudgets((prev) => [...prev, deletedItem.item as Budget])
      // Remove from deletedItems
      setDeletedItems((prev) => prev.filter((item) => item.id !== deletedItem.id))
    } else {
      // Calculate spent amount from expenses
      const categoryExpenses = expenses.filter((e) => e.category === budget.category)
      const spent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
      const remaining = budget.allocated - spent
      const progress = Math.min(100, Math.round((spent / budget.allocated) * 100))

      const newBudget = {
        ...budget,
        id: `b${Date.now()}`,
        spent,
        remaining,
        progress,
      }
      setBudgets([...budgets, newBudget])
    }
  }

  const updateBudget = (budget: Budget) => {
    setBudgets(budgets.map((b) => (b.id === budget.id ? budget : b)))
  }

  const deleteBudget = (id: string) => {
    const budgetToDelete = budgets.find((b) => b.id === id)
    if (budgetToDelete) {
      // Store the deleted item for potential undo
      setDeletedItems((prev) => [
        ...prev,
        {
          id: id,
          type: "budget",
          item: budgetToDelete,
        },
      ])

      // Remove from budgets
      setBudgets(budgets.filter((b) => b.id !== id))
    }
  }

  // Investment functions
  const addInvestment = (investment: Omit<Investment, "id" | "value" | "change">) => {
    // Check if this is an undo operation
    const deletedItem = deletedItems.find(
      (item) =>
        item.type === "investment" &&
        item.item.name === investment.name &&
        item.item.type === investment.type &&
        item.item.shares === investment.shares &&
        item.item.price === investment.price,
    )

    if (deletedItem) {
      // This is an undo operation, restore the original item with its ID
      setInvestments((prev) => [...prev, deletedItem.item as Investment])
      // Remove from deletedItems
      setDeletedItems((prev) => prev.filter((item) => item.id !== deletedItem.id))
    } else {
      const value = investment.shares * investment.price
      const newInvestment = {
        ...investment,
        id: `inv${Date.now()}`,
        value,
        change: 0,
      }
      setInvestments([...investments, newInvestment])
    }
  }

  const updateInvestment = (investment: Investment) => {
    setInvestments(investments.map((i) => (i.id === investment.id ? investment : i)))
  }

  const deleteInvestment = (id: string) => {
    const investmentToDelete = investments.find((i) => i.id === id)
    if (investmentToDelete) {
      // Store the deleted item for potential undo
      setDeletedItems((prev) => [
        ...prev,
        {
          id: id,
          type: "investment",
          item: investmentToDelete,
        },
      ])

      // Remove from investments
      setInvestments(investments.filter((i) => i.id !== id))
    }
  }

  // Goal functions
  const addGoal = (goal: Omit<Goal, "id" | "progress">) => {
    // Check if this is an undo operation
    const deletedItem = deletedItems.find(
      (item) =>
        item.type === "goal" &&
        item.item.name === goal.name &&
        item.item.type === goal.type &&
        item.item.target === goal.target &&
        item.item.current === goal.current,
    )

    if (deletedItem) {
      // This is an undo operation, restore the original item with its ID
      setGoals((prev) => [...prev, deletedItem.item as Goal])
      // Remove from deletedItems
      setDeletedItems((prev) => prev.filter((item) => item.id !== deletedItem.id))
    } else {
      const progress = Math.round((goal.current / goal.target) * 100)
      const newGoal = {
        ...goal,
        id: `g${Date.now()}`,
        progress,
      }
      setGoals([...goals, newGoal])
    }
  }

  const updateGoal = (goal: Goal) => {
    setGoals(goals.map((g) => (g.id === goal.id ? goal : g)))
  }

  const deleteGoal = (id: string) => {
    const goalToDelete = goals.find((g) => g.id === id)
    if (goalToDelete) {
      // Store the deleted item for potential undo
      setDeletedItems((prev) => [
        ...prev,
        {
          id: id,
          type: "goal",
          item: goalToDelete,
        },
      ])

      // Remove from goals
      setGoals(goals.filter((g) => g.id !== id))
    }
  }

  // Utility functions
  const getRecentTransactions = () => {
    const recentExpenses = expenses.slice(0, 4).map((expense) => ({
      id: expense.id,
      description: expense.description,
      amount: -expense.amount,
      date:
        new Date(expense.date).toLocaleDateString() === new Date().toLocaleDateString()
          ? "Today"
          : new Date(expense.date).toLocaleDateString() === new Date(Date.now() - 86400000).toLocaleDateString()
            ? "Yesterday"
            : `${new Date(expense.date).toLocaleDateString()}`,
      icon: getCategoryIcon(expense.category),
      category: expense.category,
    }))

    return recentExpenses
  }

  const getCategoryIcon = (category: string) => {
    // This would return the actual icon component in a real app
    return "icon"
  }

  const getTotalBalance = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalInvestments = investments.reduce((sum, investment) => sum + investment.value, 0)
    return 12546.0 // In a real app, this would be calculated from actual data
  }

  const getMonthlyExpenses = () => {
    return expenses.reduce((sum, expense) => {
      const expenseDate = new Date(expense.date)
      const currentDate = new Date()
      if (
        expenseDate.getMonth() === currentDate.getMonth() &&
        expenseDate.getFullYear() === currentDate.getFullYear()
      ) {
        return sum + expense.amount
      }
      return sum
    }, 0)
  }

  const getTotalInvestments = () => {
    return investments.reduce((sum, investment) => sum + investment.value, 0)
  }

  const getGoalProgress = () => {
    if (goals.length === 0) return 0
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0)
    return Math.round(totalProgress / goals.length)
  }

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        budgets,
        investments,
        goals,
        isLoading,
        addExpense,
        updateExpense,
        deleteExpense,
        addBudget,
        updateBudget,
        deleteBudget,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        addGoal,
        updateGoal,
        deleteGoal,
        getRecentTransactions,
        getTotalBalance,
        getMonthlyExpenses,
        getTotalInvestments,
        getGoalProgress,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

// Custom hook to use the context
export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}

