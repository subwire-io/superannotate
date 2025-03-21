"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

type UserProfile = {
  name: string
  email: string
  avatar?: string
  initials: string
  role: string
  department: string
  location: string
  bio: string
}

export function ProfileDialog({
  open,
  onOpenChange,
  profile,
  onUpdateProfile,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: UserProfile
  onUpdateProfile: (profile: UserProfile) => void
}) {
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile)
  const [activeTab, setActiveTab] = useState("info")

  const handleSave = () => {
    onUpdateProfile(editedProfile)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Your Profile</DialogTitle>
          <DialogDescription>View and edit your profile information.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-24 w-24">
            {profile.avatar ? <AvatarImage src={profile.avatar} alt={profile.name} /> : null}
            <AvatarFallback className="text-2xl">{profile.initials}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold">{profile.name}</h3>
          <p className="text-sm text-muted-foreground">
            {profile.role} • {profile.department}
          </p>
        </div>

        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={editedProfile.department}
                  onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editedProfile.location}
                  onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
              />
            </div>
          </TabsContent>
          <TabsContent value="security" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

