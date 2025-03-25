"use client"

import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Edit, Plus, Search, Trash } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { menuCategories, menuItems } from "@/data/mock-data"
import type { MenuItem } from "@/types"

// Form schema for adding a menu item
const menuItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Please select a category"),
})

// Form schema for editing a menu item
const editMenuItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Please select a category"),
})

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchText, setSearchText] = useState<string>("")
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>(menuItems)
  const [deletedItem, setDeletedItem] = useState<MenuItem | null>(null)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Setup form with react-hook-form for adding items
  const addForm = useForm<z.infer<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      categoryId: "",
    },
  })

  // Setup form with react-hook-form for editing items
  const editForm = useForm<z.infer<typeof editMenuItemSchema>>({
    resolver: zodResolver(editMenuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      categoryId: "",
    },
  })

  // Filter menu items based on category and search text
  const filteredItems = menuItemsList.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory
    const matchesSearch =
      searchText === "" ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Handle availability change
  const handleAvailabilityChange = (itemId: string, available: boolean) => {
    setMenuItemsList((prev) => prev.map((item) => (item.id === itemId ? { ...item, available } : item)))

    const item = menuItemsList.find((item) => item.id === itemId)
    if (item) {
      toast.success(`${item.name} ${available ? "available" : "unavailable"}`, {
        dismissible: true,
      })
    }
  }

  // Handle delete item
  const handleDeleteItem = (itemId: string) => {
    const itemToDelete = menuItemsList.find((item) => item.id === itemId)
    if (itemToDelete) {
      setDeletedItem(itemToDelete)
      setMenuItemsList(menuItemsList.filter((item) => item.id !== itemId))
      toast.success(`${itemToDelete.name} has been removed from the menu`, {
        dismissible: true,
        action: {
          label: "Undo",
          onClick: handleUndoDelete,
        },
      })
    }
  }

  // Handle undo delete
  const handleUndoDelete = () => {
    if (deletedItem) {
      setMenuItemsList([...menuItemsList, deletedItem])
      setDeletedItem(null)
      toast.success(`${deletedItem.name} has been restored to the menu`, {
        dismissible: true,
      })
    }
  }

  // Handle form submission for adding items
  const onAddSubmit = (data: z.infer<typeof menuItemSchema>) => {
    const newItem: MenuItem = {
      id: `new-${Date.now()}`, // Ensure unique ID with timestamp to prevent collisions
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      image: "/placeholder.svg?height=200&width=200",
      available: true,
      popular: false,
      allergens: [],
    }

    setMenuItemsList([...menuItemsList, newItem])
    toast.success(`${data.name} has been added to the menu`, {
      dismissible: true,
    })
    addForm.reset()
    setIsAddItemOpen(false)
  }

  // Handle edit dialog open
  const handleEditDialogOpen = (item: MenuItem) => {
    setEditingItem(item)
    editForm.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
    })
    setIsEditDialogOpen(true)
  }

  // Handle edit dialog close
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false)
    // Clear editing item after dialog is closed
    setTimeout(() => {
      setEditingItem(null)
    }, 300)
  }

  // Handle form submission for editing items
  const onEditSubmit = (data: z.infer<typeof editMenuItemSchema>) => {
    if (!editingItem) return

    const updatedItem = {
      ...editingItem,
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
    }

    setMenuItemsList(menuItemsList.map((item) => (item.id === editingItem.id ? updatedItem : item)))
    toast.success(`${data.name} has been updated`, {
      dismissible: true,
    })
    setIsEditDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 max-w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="py-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">Menu Management</h1>
          <p className="text-muted-foreground">Create and edit your restaurant menu</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button className="transition-all hover:border-primary/50 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Add Menu Item</DialogTitle>
                <DialogDescription>Create a new item for your restaurant menu</DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Item name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Item description" className="min-h-[100px] resize-y" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="Item price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {menuCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" className="transition-all hover:border-primary/50">
                      Add to Menu
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            className="pl-8"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {menuCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No menu items found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-all hover:border-primary/20 flex flex-col h-full">
              <div className="relative h-48">
                <Image
                  src={item.image || "/placeholder.svg?height=200&width=200"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                {item.popular && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                    POPULAR
                  </div>
                )}
              </div>
              <CardHeader className="pb-2 px-5 pt-5">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg break-words">{item.name}</CardTitle>
                  <div className="font-bold whitespace-nowrap">{formatCurrency(item.price)}</div>
                </div>
                <CardDescription className="break-words">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <div className="flex flex-wrap gap-1">
                  {item.allergens?.map((allergen) => (
                    <span key={allergen} className="text-xs bg-muted px-2 py-1 rounded-full">
                      {allergen}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 mt-auto pt-2">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Label htmlFor={`available-${item.id}`} className="whitespace-nowrap">
                    Available:
                  </Label>
                  <Switch
                    id={`available-${item.id}`}
                    checked={item.available}
                    onCheckedChange={(checked) => handleAvailabilityChange(item.id, checked)}
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all hover:border-primary/50 flex-1 sm:flex-auto"
                    onClick={() => handleEditDialogOpen(item)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="transition-all hover:border-destructive/50">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove "{item.name}" from your menu. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="transition-all hover:border-primary/50">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteItem(item.id)}
                          className="transition-all hover:border-destructive/50"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog - Improved to avoid reconciliation issues */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogClose}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-auto">
          {editingItem && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Menu Item</DialogTitle>
                <DialogDescription>Update this menu item</DialogDescription>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Item name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Item description" className="min-h-[100px] resize-y" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="Item price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {menuCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" className="transition-all hover:border-primary/50">
                      Save Changes
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

