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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Plus, Trash } from "lucide-react"

import { users } from "@/data/mock-data"
import type { UserRole } from "@/types"
import Image from "next/image"

export default function StaffPage() {
  const [searchText, setSearchText] = useState<string>("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  // Filter staff based on role and search text
  const filteredStaff = users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesSearch =
      searchText === "" ||
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())

    return matchesRole && matchesSearch
  })

  // Function to render role badge with appropriate color
  const renderRoleBadge = (role: UserRole) => {
    const roleStyles = {
      admin: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500",
      manager: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
      waiter: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
      chef: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    }

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${roleStyles[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage your restaurant staff</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>Enter the details for the new staff member</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" placeholder="Full name" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" type="email" className="col-span-3" placeholder="Email address" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select>
                    <SelectTrigger id="role" className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="waiter">Waiter</SelectItem>
                      <SelectItem value="chef">Chef</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="avatar" className="text-right">
                    Avatar URL
                  </Label>
                  <Input id="avatar" className="col-span-3" placeholder="Avatar image URL" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Staff Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row">
          <div>
            <CardTitle>Staff Directory</CardTitle>
            <CardDescription>View and manage your restaurant staff</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 sm:ml-auto">
            <Input
              placeholder="Search staff..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="sm:w-[200px]"
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="waiter">Waiter</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grid" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            <TabsContent value="grid" className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredStaff.map((staff) => (
                  <Card key={staff.id}>
                    <CardHeader className="text-center pb-2">
                      <div className="flex justify-center mb-2">
                        <div className="w-20 h-20 rounded-full overflow-hidden relative">
                          <Image
                            src={staff.avatar || "/placeholder.svg?height=80&width=80"}
                            alt={staff.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <CardTitle className="text-lg">{staff.name}</CardTitle>
                      <CardDescription>{staff.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">{renderRoleBadge(staff.role)}</CardContent>
                    <CardFooter className="flex justify-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Staff Member</DialogTitle>
                            <DialogDescription>Update staff member details</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor={`edit-name-${staff.id}`} className="text-right">
                                Name
                              </Label>
                              <Input id={`edit-name-${staff.id}`} className="col-span-3" defaultValue={staff.name} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor={`edit-email-${staff.id}`} className="text-right">
                                Email
                              </Label>
                              <Input
                                id={`edit-email-${staff.id}`}
                                type="email"
                                className="col-span-3"
                                defaultValue={staff.email}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor={`edit-role-${staff.id}`} className="text-right">
                                Role
                              </Label>
                              <Select defaultValue={staff.role}>
                                <SelectTrigger id={`edit-role-${staff.id}`} className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="waiter">Waiter</SelectItem>
                                  <SelectItem value="chef">Chef</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" size="sm">
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="table" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No staff members found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStaff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                <Image
                                  src={staff.avatar || "/placeholder.svg?height=40&width=40"}
                                  alt={staff.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="font-medium">{staff.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{staff.email}</TableCell>
                          <TableCell>{renderRoleBadge(staff.role)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Staff Member</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor={`edit-name-table-${staff.id}`} className="text-right">
                                        Name
                                      </Label>
                                      <Input
                                        id={`edit-name-table-${staff.id}`}
                                        className="col-span-3"
                                        defaultValue={staff.name}
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor={`edit-email-table-${staff.id}`} className="text-right">
                                        Email
                                      </Label>
                                      <Input
                                        id={`edit-email-table-${staff.id}`}
                                        type="email"
                                        className="col-span-3"
                                        defaultValue={staff.email}
                                      />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor={`edit-role-table-${staff.id}`} className="text-right">
                                        Role
                                      </Label>
                                      <Select defaultValue={staff.role}>
                                        <SelectTrigger id={`edit-role-table-${staff.id}`} className="col-span-3">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="admin">Admin</SelectItem>
                                          <SelectItem value="manager">Manager</SelectItem>
                                          <SelectItem value="waiter">Waiter</SelectItem>
                                          <SelectItem value="chef">Chef</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit">Save Changes</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button variant="destructive" size="sm">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

