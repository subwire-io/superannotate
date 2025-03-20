"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Edit, Plus, Search, Trash } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { menuCategories, menuItems } from "@/data/mock-data"
import Image from "next/image"

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchText, setSearchText] = useState<string>("")

  // Filter menu items based on category and search text
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory
    const matchesSearch =
      searchText === "" ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const handleAvailabilityChange = (itemId: string, available: boolean) => {
    // In a real app, update the item availability in the database
    console.log(`Setting menu item ${itemId} availability to ${available}`)
  }

  const handleDeleteItem = (itemId: string) => {
    // In a real app, delete the item from the database
    console.log(`Deleting menu item ${itemId}`)
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
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add Menu Item</DialogTitle>
                <DialogDescription>Create a new item for your restaurant menu</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item-name" className="text-right">
                    Name
                  </Label>
                  <Input id="item-name" className="col-span-3" placeholder="Item name" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item-description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="item-description" className="col-span-3" placeholder="Item description" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item-price" className="text-right">
                    Price
                  </Label>
                  <Input id="item-price" type="number" step="0.01" className="col-span-3" placeholder="Item price" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item-category" className="text-right">
                    Category
                  </Label>
                  <Select>
                    <SelectTrigger id="item-category" className="col-span-3">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item-image" className="text-right">
                    Image URL
                  </Label>
                  <Input id="item-image" className="col-span-3" placeholder="Image URL" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Available</Label>
                  <div className="flex items-center gap-2 col-span-3">
                    <Switch id="item-available" defaultChecked />
                    <Label htmlFor="item-available">Item is available for ordering</Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Popular</Label>
                  <div className="flex items-center gap-2 col-span-3">
                    <Switch id="item-popular" />
                    <Label htmlFor="item-popular">Mark as popular item</Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item-allergens" className="text-right">
                    Allergens
                  </Label>
                  <Input id="item-allergens" className="col-span-3" placeholder="Comma-separated allergens" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add to Menu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Manage Categories</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Menu Categories</DialogTitle>
                <DialogDescription>Manage your menu categories</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {menuCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Input placeholder="New category name" />
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
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
                {menuCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
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
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>Edit Menu Item</DialogTitle>
                          <DialogDescription>Update this menu item</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`edit-name-${item.id}`} className="text-right">
                              Name
                            </Label>
                            <Input id={`edit-name-${item.id}`} className="col-span-3" defaultValue={item.name} />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`edit-desc-${item.id}`} className="text-right">
                              Description
                            </Label>
                            <Textarea
                              id={`edit-desc-${item.id}`}
                              className="col-span-3"
                              defaultValue={item.description}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`edit-price-${item.id}`} className="text-right">
                              Price
                            </Label>
                            <Input
                              id={`edit-price-${item.id}`}
                              type="number"
                              step="0.01"
                              className="col-span-3"
                              defaultValue={item.price}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`edit-cat-${item.id}`} className="text-right">
                              Category
                            </Label>
                            <Select defaultValue={item.categoryId}>
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
                          <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
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
                    <tr key={item.id} className="border-b">
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
                      <td className="p-4">{menuCategories.find((c) => c.id === item.categoryId)?.name}</td>
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
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Menu Item</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor={`edit-name-list-${item.id}`} className="text-right">
                                    Name
                                  </Label>
                                  <Input
                                    id={`edit-name-list-${item.id}`}
                                    className="col-span-3"
                                    defaultValue={item.name}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor={`edit-price-list-${item.id}`} className="text-right">
                                    Price
                                  </Label>
                                  <Input
                                    id={`edit-price-list-${item.id}`}
                                    type="number"
                                    step="0.01"
                                    className="col-span-3"
                                    defaultValue={item.price}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

