"use client"

import { useState } from "react"
import Image from "next/image"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Plus, Trash, Users } from "lucide-react"

import { users } from "@/data/mock-data"
import type { User, UserRole } from "@/types"

export default function StaffPage() {
  const [searchText, setSearchText] = useState<string>("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [staffList, setStaffList] = useState<User[]>(users)
  const [deletedStaff, setDeletedStaff] = useState<User | null>(null)

  // Filter staff based on role and search text
  const filteredStaff = staffList.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesSearch =
      searchText === "" ||
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())

    return matchesRole && matchesSearch
  })

  // Function to handle staff deletion
  const handleDeleteStaff = (staffId: string) => {
    const staffToDelete = staffList.find((staff) => staff.id === staffId)
    if (staffToDelete) {
      setDeletedStaff(staffToDelete)
      setStaffList(staffList.filter((staff) => staff.id !== staffId))

      toast(`${staffToDelete.name} has been removed`, {
        dismissible: true,
        description: "Staff member deleted",
        action: {
          label: "Undo",
          onClick: handleUndoDelete,
        },
      })
    }
  }

  // Function to undo staff deletion
  const handleUndoDelete = () => {
    if (deletedStaff) {
      setStaffList([...staffList, deletedStaff])
      setDeletedStaff(null)

      toast(`${deletedStaff.name} has been restored`, {
        dismissible: true,
        description: "Deletion undone",
      })
    }
  }

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage your restaurant staff</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="transition-all hover:shadow-md">
                <Plus className="h-4 w-4 mr-2" /> Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>Enter the details for the new staff member</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const newStaff: User = {
                    id: (staffList.length + 1).toString(),
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    role: formData.get("role") as UserRole,
                    avatar: "/placeholder.svg?height=40&width=40",
                  }
                  setStaffList([...staffList, newStaff])
                  toast(`${newStaff.name} has been added to the staff list`, {
                    dismissible: true,
                    description: "Staff member added",
                  })
                  ;(e.target as HTMLFormElement).reset()
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" name="name" className="col-span-3" placeholder="Full name" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="col-span-3"
                      placeholder="Email address"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select name="role" defaultValue="waiter">
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
                </div>
                <DialogFooter>
                  <Button type="submit" className="transition-all hover:shadow-md">
                    Add Staff Member
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="transition-all hover:border-primary/20">
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
              <TabsTrigger value="grid" className="transition-all hover:bg-accent">
                Grid View
              </TabsTrigger>
              <TabsTrigger value="table" className="transition-all hover:bg-accent">
                Table View
              </TabsTrigger>
            </TabsList>
            <TabsContent value="grid" className="space-y-4">
              {filteredStaff.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center w-full">
                  <div className="mx-auto max-w-md">
                    <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No staff members found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredStaff.map((staff) => (
                    <Card key={staff.id} className="transition-all hover:border-primary/20">
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
                            <Button variant="outline" size="sm" className="transition-all hover:bg-accent">
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Staff Member</DialogTitle>
                              <DialogDescription>Update staff member details</DialogDescription>
                            </DialogHeader>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                const updatedStaff = {
                                  ...staff,
                                  name: formData.get("edit-name") as string,
                                  email: formData.get("edit-email") as string,
                                  role: formData.get("edit-role") as UserRole,
                                }
                                setStaffList(staffList.map((s) => (s.id === staff.id ? updatedStaff : s)))
                                toast(`${updatedStaff.name}'s information has been updated`, {
                                  dismissible: true,
                                  description: "Staff member updated",
                                })
                              }}
                            >
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor={`edit-name-${staff.id}`} className="text-right">
                                    Name
                                  </Label>
                                  <Input
                                    id={`edit-name-${staff.id}`}
                                    name="edit-name"
                                    className="col-span-3"
                                    defaultValue={staff.name}
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor={`edit-email-${staff.id}`} className="text-right">
                                    Email
                                  </Label>
                                  <Input
                                    id={`edit-email-${staff.id}`}
                                    name="edit-email"
                                    type="email"
                                    className="col-span-3"
                                    defaultValue={staff.email}
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor={`edit-role-${staff.id}`} className="text-right">
                                    Role
                                  </Label>
                                  <Select name="edit-role" defaultValue={staff.role}>
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
                              <Trash className="h-4 w-4 mr-2" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove {staff.name} from the staff list. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="transition-all hover:bg-accent">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteStaff(staff.id)}
                                className="transition-all hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
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
                        <TableCell colSpan={4} className="text-center py-12 px-6">
                          <div className="mx-auto max-w-md">
                            <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
                              <Users className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">No staff members found</h3>
                            <p className="text-muted-foreground mt-1">
                              Try adjusting your search or filters to find what you're looking for.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStaff.map((staff) => (
                        <TableRow key={staff.id} className="transition-colors hover:bg-muted/50">
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
                                  <Button variant="outline" size="sm" className="transition-all hover:bg-accent">
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Staff Member</DialogTitle>
                                  </DialogHeader>
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault()
                                      const formData = new FormData(e.currentTarget)
                                      const updatedStaff = {
                                        ...staff,
                                        name: formData.get("edit-name-table") as string,
                                        email: formData.get("edit-email-table") as string,
                                        role: formData.get("edit-role-table") as UserRole,
                                      }
                                      setStaffList(staffList.map((s) => (s.id === staff.id ? updatedStaff : s)))
                                      toast(`${updatedStaff.name}'s information has been updated`, {
                                        dismissible: true,
                                        description: "Staff member updated",
                                      })
                                    }}
                                  >
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor={`edit-name-table-${staff.id}`} className="text-right">
                                          Name
                                        </Label>
                                        <Input
                                          id={`edit-name-table-${staff.id}`}
                                          name="edit-name-table"
                                          className="col-span-3"
                                          defaultValue={staff.name}
                                          required
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor={`edit-email-table-${staff.id}`} className="text-right">
                                          Email
                                        </Label>
                                        <Input
                                          id={`edit-email-table-${staff.id}`}
                                          name="edit-email-table"
                                          type="email"
                                          className="col-span-3"
                                          defaultValue={staff.email}
                                          required
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor={`edit-role-table-${staff.id}`} className="text-right">
                                          Role
                                        </Label>
                                        <Select name="edit-role-table" defaultValue={staff.role}>
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
                                      This will remove {staff.name} from the staff list. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="transition-all hover:bg-accent">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteStaff(staff.id)}
                                      className="transition-all hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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

