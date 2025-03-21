"use client"

import { useState } from "react"
import Image from "next/image"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Plus, Search, Trash } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { menuCategories, menuItems } from "@/data/mock-data"
import type { MenuItem } from "@/types"

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchText, setSearchText] = useState<string>("")
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>(menuItems)
  const [deletedItem, setDeletedItem] = useState<MenuItem | null>(null)
  const { toast } = useToast()

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
      toast({
        title: `${item.name} ${available ? "available" : "unavailable"}`,
        description: `The item is now ${available ? "available" : "unavailable"} for ordering`,
      })
    }
  }

  // Handle delete item
  const handleDeleteItem = (itemId: string) => {
    const itemToDelete = menuItemsList.find((item) => item.id === itemId)
    if (itemToDelete) {
      setDeletedItem(itemToDelete)
      setMenuItemsList(menuItemsList.filter((item) => item.id !== itemId))

      toast({
        title: "Menu item deleted",
        description: `${itemToDelete.name} has been removed from the menu`,
        action: (
          <Button
            variant="outline"
            onClick={handleUndoDelete}
            className="transition-all hover:bg-primary hover:text-primary-foreground"
          >
            Undo
          </Button>
        ),
      })
    }
  }

  // Handle undo delete
  const handleUndoDelete = () => {
    if (deletedItem) {
      setMenuItemsList([...menuItemsList, deletedItem])
      setDeletedItem(null)

      toast({
        title: "Deletion undone",
        description: `${deletedItem.name} has been restored to the menu`,
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Create and edit your restaurant menu</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="transition-all hover:shadow-md">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add Menu Item</DialogTitle>
                <DialogDescription>Create a new item for your restaurant menu</DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const newItem: MenuItem = {
                    id: (menuItemsList.length + 1).toString(),
                    name: formData.get("name") as string,
                    description: formData.get("description") as string,
                    price: Number.parseFloat(formData.get("price") as string),
                    categoryId: formData.get("categoryId") as string,
                    image: "/placeholder.svg?height=200&width=200",
                    available: true,
                    popular: false,
                    allergens: [],
                  }

                  setMenuItemsList([...menuItemsList, newItem])

                  toast({
                    title: "Menu item added",
                    description: `${newItem.name} has been added to the menu`,
                  })
                  ;(e.target as HTMLFormElement).reset()
                }}
              >
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" name="name" className="col-span-3" placeholder="Item name" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      className="col-span-3"
                      placeholder="Item description"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      className="col-span-3"
                      placeholder="Item price"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categoryId" className="text-right">
                      Category
                    </Label>
                    <Select name="categoryId">
                      <SelectTrigger id="categoryId" className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {menuCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="transition-all hover:shadow-md">
                    Add to Menu
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-2 mb-4">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            className="pl-8"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
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
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No menu items found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
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
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <div className="font-bold">{formatCurrency(item.price)}</div>
                </div>
                <CardDescription>
                  {item.description.length > 100 ? item.description.substring(0, 100) + "..." : item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-1">
                  {item.allergens?.map((allergen) => (
                    <span key={allergen} className="text-xs bg-muted px-2 py-1 rounded-full">
                      {allergen}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`available-${item.id}`}>Available:</Label>
                  <Switch
                    id={`available-${item.id}`}
                    checked={item.available}
                    onCheckedChange={(checked) => handleAvailabilityChange(item.id, checked)}
                  />
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="transition-all hover:bg-accent">
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Edit Menu Item</DialogTitle>
                        <DialogDescription>Update this menu item</DialogDescription>
                      </DialogHeader>
                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault()
                          const formData = new FormData(e.currentTarget)

                          const updatedItem = {
                            ...item,
                            name: formData.get("edit-name") as string,
                            description: formData.get("edit-desc") as string,
                            price: Number.parseFloat(formData.get("edit-price") as string),
                            categoryId: formData.get("edit-category") as string,
                          }

                          setMenuItemsList(menuItemsList.map((i) => (i.id === item.id ? updatedItem : i)))

                          toast({
                            title: "Menu item updated",
                            description: `${updatedItem.name} has been updated`,
                          })
                        }}
                      >
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`edit-name-${item.id}`} className="text-right">
                              Name
                            </Label>
                            <Input
                              id={`edit-name-${item.id}`}
                              name="edit-name"
                              className="col-span-3"
                              defaultValue={item.name}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`edit-desc-${item.id}`} className="text-right">
                              Description
                            </Label>
                            <Input
                              id={`edit-desc-${item.id}`}
                              name="edit-desc"
                              className="col-span-3"
                              defaultValue={item.description}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`edit-price-${item.id}`} className="text-right">
                              Price
                            </Label>
                            <Input
                              id={`edit-price-${item.id}`}
                              name="edit-price"
                              type="number"
                              step="0.01"
                              className="col-span-3"
                              defaultValue={item.price}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`edit-cat-${item.id}`} className="text-right">
                              Category
                            </Label>
                            <Select name="edit-category" defaultValue={item.categoryId}>
                              <SelectTrigger id={`edit-cat-${item.id}`} className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {menuCategories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="transition-all hover:shadow-md">
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="transition-all hover:bg-destructive/90">
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
                        <AlertDialogCancel className="transition-all hover:bg-accent">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteItem(item.id)}
                          className="transition-all hover:bg-destructive/90"
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
    </div>
  )
}

