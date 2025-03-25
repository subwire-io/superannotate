"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFinance } from "@/lib/data-context"
import { InvestmentForm } from "@/components/forms/investment-form"
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

export function InvestmentTable() {
  const { investments, deleteInvestment } = useFinance()
  const { toast } = useToast()
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (id: string) => {
    setSelectedInvestment(id)
    setIsEditing(true)
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
        action: (
          <Button
            variant="outline"
            onClick={() => {
              // Implement undo functionality
              toast({
                title: "Action undone",
                description: "The investment has been restored.",
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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Shares/Units</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Change</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.length > 0 ? (
              investments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell className="font-medium">{investment.name}</TableCell>
                  <TableCell>{investment.type}</TableCell>
                  <TableCell>{investment.shares}</TableCell>
                  <TableCell>${investment.price.toFixed(2)}</TableCell>
                  <TableCell>${investment.value.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {investment.change > 0 ? (
                        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <span className={investment.change > 0 ? "text-green-500" : "text-red-500"}>
                        {investment.change > 0 ? "+" : ""}
                        {investment.change}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(investment.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(investment.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No investments found. Add one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isEditing && selectedInvestment && (
        <InvestmentForm
          investmentId={selectedInvestment}
          onClose={() => {
            setIsEditing(false)
            setSelectedInvestment(null)
          }}
        />
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
    </>
  )
}

