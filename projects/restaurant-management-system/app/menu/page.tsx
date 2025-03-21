"use client"

import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Plus, Search, Trash } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { menuCategories, menuItems } from "@/data/mock-data"
import type { MenuItem, MenuCategory } from "@/types"

// Form validation schema for menu item
const menuItemSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  categoryId: z.string({ required_error: "Please select a category" }),
  image: z.string().optional(),
  available: z.boolean().default(true),
  popular: z.boolean().default(false),
  allergens: z.string().optional(),
})

type MenuItemFormValues = z.infer<typeof menuItemSchema>

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchText, setSearchText] = useState<string>("")
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>(menuItems)
  const [menuCategoriesList, setMenuCategoriesList] = useState<MenuCategory[]>(menuCategories)
  const [deletedItem, setDeletedItem] = useState<MenuItem | null>(null)
  const { toast } = useToast()

  // Initialize form
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      image: "/placeholder.svg?height=200&width=200",
      available: true,
      popular: false,
      allergens: "",
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

  // Handle form submission
  const onSubmit = (data: MenuItemFormValues) => {
    const newItem: MenuItem = {
      id: (menuItemsList.length + 1).toString(),
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      image: data.image || "/placeholder.svg?height=200&width=200",
      available: data.available,
      popular: data.popular,
      allergens: data.allergens ? data.allergens.split(",").map((a) => a.trim()) : [],
    }

    setMenuItemsList([...menuItemsList, newItem])

    toast({
      title: "Menu item added",
      description: `${data.name} has been added to the menu`,
    })

    form.reset()
  }

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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Item description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {menuCategoriesList.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Image URL" {...field} />
                        </FormControl>
                        <FormDescription>Leave empty to use a placeholder image</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="available"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Available</FormLabel>
                          <FormDescription>Make this item available for ordering</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="popular"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Popular</FormLabel>
                          <FormDescription>Mark as a popular item</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allergens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergens</FormLabel>
                        <FormControl>
                          <Input placeholder="Comma-separated allergens" {...field} />
                        </FormControl>
                        <FormDescription>E.g., Gluten, Dairy, Nuts</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" className="transition-all hover:shadow-md">
                      Add to Menu
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="transition-all hover:shadow-md">
                Manage Categories
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Menu Categories</DialogTitle>
                <DialogDescription>Manage your menu categories</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {menuCategoriesList.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="transition-all hover:bg-accent">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="transition-all hover:bg-destructive/90">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will delete the "{category.name}" category and may affect menu items assigned to it.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="transition-all hover:bg-accent">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                setMenuCategoriesList(menuCategoriesList.filter((c) => c.id !== category.id))
                                toast({
                                  title: "Category deleted",
                                  description: `${category.name} has been removed`,
                                  action: (
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setMenuCategoriesList([...menuCategoriesList, category])
                                        toast({
                                          title: "Deletion undone",
                                          description: `${category.name} has been restored`,
                                        })
                                      }}
                                      className="transition-all hover:bg-primary hover:text-primary-foreground"
                                    >
                                      Undo
                                    </Button>
                                  ),
                                })
                              }}
                              className="transition-all hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
                <form
                  className="flex items-center gap-2 pt-4 border-t"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const categoryName = formData.get("categoryName") as string

                    if (categoryName.trim()) {
                      const newCategory: MenuCategory = {
                        id: (menuCategoriesList.length + 1).toString(),
                        name: categoryName,
                        description: "New category",
                      }

                      setMenuCategoriesList([...menuCategoriesList, newCategory])
                      toast({
                        title: "Category added",
                        description: `${categoryName} has been added to categories`,
                      })
                      ;(e.target as HTMLFormElement).reset()
                    }
                  }}
                >
                  <Input name="categoryName" placeholder="New category name" required />
                  <Button type="submit" className="transition-all hover:shadow-md">
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <TabsList>
            <TabsTrigger value="grid" className="transition-all hover:bg-accent">
              Grid View
            </TabsTrigger>
            <TabsTrigger value="list" className="transition-all hover:bg-accent">
              List View
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {menuCategoriesList.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="grid" className="space-y-4">
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
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                                <Textarea
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
                                    {menuCategoriesList.map((category) => (
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
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-0">
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
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Item</th>
                      <th className="text-left p-4">Category</th>
                      <th className="text-left p-4">Price</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 relative">
                              <Image
                                src={item.image || "/placeholder.svg?height=40&width=40"}
                                alt={item.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{menuCategoriesList.find((c) => c.id === item.categoryId)?.name}</td>
                        <td className="p-4">{formatCurrency(item.price)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`available-list-${item.id}`}
                              checked={item.available}
                              onCheckedChange={(checked) => handleAvailabilityChange(item.id, checked)}
                            />
                            <Label htmlFor={`available-list-${item.id}`}>
                              {item.available ? "Available" : "Unavailable"}
                            </Label>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="transition-all hover:bg-accent">
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Menu Item</DialogTitle>
                                </DialogHeader>
                                <form
                                  className="space-y-4"
                                  onSubmit={(e) => {
                                    e.preventDefault()
                                    const formData = new FormData(e.currentTarget)

                                    const updatedItem = {
                                      ...item,
                                      name: formData.get("edit-name-list") as string,
                                      price: Number.parseFloat(formData.get("edit-price-list") as string),
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
                                      <Label htmlFor={`edit-name-list-${item.id}`} className="text-right">
                                        Name
                                      </Label>
                                      <Input
                                        id={`edit-name-list-${item.id}`}
                                        name="edit-name-list"
                                        className="col-span-3"
                                        defaultValue={item.name}
                                        required
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor={`edit-price-list-${item.id}`} className="text-right">
                                        Price
                                      </Label>
                                      <Input
                                        id={`edit-price-list-${item.id}`}
                                        name="edit-price-list"
                                        type="number"
                                        step="0.01"
                                        className="col-span-3"
                                        defaultValue={item.price}
                                        required
                                      />
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
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="transition-all hover:bg-destructive/90"
                                >
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
                                  <AlertDialogCancel className="transition-all hover:bg-accent">
                                    Cancel
                                  </AlertDialogCancel>
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

