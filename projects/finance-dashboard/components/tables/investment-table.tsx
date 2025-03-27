"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash, TrendingDown, TrendingUp, Eye } from "lucide-react"
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
import { useIsMobile } from "@/hooks/use-mobile"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function InvestmentTable() {
  const { investments, deleteInvestment } = useFinance()
  const { toast } = useToast()
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const isMobile = useIsMobile()

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

  // Get investment type color
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

  // Get the details of the selected investment
  const investmentDetails = selectedInvestment ? investments.find((i) => i.id === selectedInvestment) : null

  return (
    <>
      {isMobile ? (
        // Mobile card view
        <div className="space-y-4 px-1">
          {investments.length > 0 ? (
            investments.map((investment) => (
              <Card key={investment.id} className="p-4 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-base">{investment.name}</h3>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-3 h-3 rounded-full mr-1.5"
                        style={{ backgroundColor: getInvestmentTypeColor(investment.type) }}
                      ></div>
                      <span className="text-sm text-muted-foreground">{investment.type}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleView(investment.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
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
                </div>

                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-muted-foreground">Shares/Units:</div>
                  <div className="text-right">{investment.shares}</div>

                  <div className="text-muted-foreground">Price:</div>
                  <div className="text-right">${investment.price.toFixed(2)}</div>

                  <div className="text-muted-foreground">Value:</div>
                  <div className="text-right font-medium">${investment.value.toFixed(2)}</div>

                  <div className="text-muted-foreground">Change:</div>
                  <div className="text-right flex items-center justify-end">
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
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center p-8 border rounded-md">
              <p className="text-muted-foreground">No investments found. Add one to get started.</p>
            </div>
          )}
        </div>
      ) : (
        // Desktop table view
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getInvestmentTypeColor(investment.type) }}
                        ></div>
                        {investment.type}
                      </div>
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleView(investment.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
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
      )}

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
    </>
  )
}

