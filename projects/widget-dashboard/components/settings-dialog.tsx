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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Loader2 } from "lucide-react"

type UserSettings = {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    inApp: boolean
  }
  appearance: {
    theme: "light" | "dark" | "system"
    density: "compact" | "comfortable" | "spacious"
    animations: boolean
  }
  privacy: {
    profileVisibility: "public" | "team" | "private"
    activityStatus: boolean
    readReceipts: boolean
  }
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onUpdateSettings,
  darkMode,
  onToggleDarkMode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: UserSettings
  onUpdateSettings: (settings: UserSettings) => void
  darkMode: boolean
  onToggleDarkMode: () => void
}) {
  const [editedSettings, setEditedSettings] = useState<UserSettings>(settings)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onUpdateSettings(editedSettings)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your dashboard experience.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="notifications" className="pt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="notifications"
              className="transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications about activity.</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={editedSettings.notifications.email}
                  onCheckedChange={(checked) =>
                    setEditedSettings({
                      ...editedSettings,
                      notifications: { ...editedSettings.notifications, email: checked },
                    })
                  }
                  className="transition-opacity data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your devices.</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={editedSettings.notifications.push}
                  onCheckedChange={(checked) =>
                    setEditedSettings({
                      ...editedSettings,
                      notifications: { ...editedSettings.notifications, push: checked },
                    })
                  }
                  className="transition-opacity data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive text message notifications for important updates.
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={editedSettings.notifications.sms}
                  onCheckedChange={(checked) =>
                    setEditedSettings({
                      ...editedSettings,
                      notifications: { ...editedSettings.notifications, sms: checked },
                    })
                  }
                  className="transition-opacity data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="inapp-notifications">In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications within the application.</p>
                </div>
                <Switch
                  id="inapp-notifications"
                  checked={editedSettings.notifications.inApp}
                  onCheckedChange={(checked) =>
                    setEditedSettings({
                      ...editedSettings,
                      notifications: { ...editedSettings.notifications, inApp: checked },
                    })
                  }
                  className="transition-opacity data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-select">Theme</Label>
                <Select
                  value={editedSettings.appearance.theme}
                  onValueChange={(value: "light" | "dark" | "system") =>
                    setEditedSettings({
                      ...editedSettings,
                      appearance: { ...editedSettings.appearance, theme: value },
                    })
                  }
                >
                  <SelectTrigger
                    id="theme-select"
                    className="transition-colors hover:bg-muted focus:ring-1 focus:ring-ring"
                  >
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="density-select">Density</Label>
                <Select
                  value={editedSettings.appearance.density}
                  onValueChange={(value: "compact" | "comfortable" | "spacious") =>
                    setEditedSettings({
                      ...editedSettings,
                      appearance: { ...editedSettings.appearance, density: value },
                    })
                  }
                >
                  <SelectTrigger
                    id="density-select"
                    className="transition-colors hover:bg-muted focus:ring-1 focus:ring-ring"
                  >
                    <SelectValue placeholder="Select density" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable animations throughout the interface.</p>
                </div>
                <Switch
                  id="animations"
                  checked={editedSettings.appearance.animations}
                  onCheckedChange={(checked) =>
                    setEditedSettings({
                      ...editedSettings,
                      appearance: { ...editedSettings.appearance, animations: checked },
                    })
                  }
                  className="transition-opacity data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark mode.</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={onToggleDarkMode}
                  className="transition-opacity data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <Select
                  value={editedSettings.privacy.profileVisibility}
                  onValueChange={(value: "public" | "team" | "private") =>
                    setEditedSettings({
                      ...editedSettings,
                      privacy: { ...editedSettings.privacy, profileVisibility: value },
                    })
                  }
                >
                  <SelectTrigger
                    id="profile-visibility"
                    className="transition-colors hover:bg-muted focus:ring-1 focus:ring-ring"
                  >
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="team">Team Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="activity-status">Activity Status</Label>
                  <p className="text-sm text-muted-foreground">Show when you're active on the platform.</p>
                </div>
                <Switch
                  id="activity-status"
                  checked={editedSettings.privacy.activityStatus}
                  onCheckedChange={(checked) =>
                    setEditedSettings({
                      ...editedSettings,
                      privacy: { ...editedSettings.privacy, activityStatus: checked },
                    })
                  }
                  className="transition-opacity data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="read-receipts">Read Receipts</Label>
                  <p className="text-sm text-muted-foreground">Let others know when you've read their messages.</p>
                </div>
                <Switch
                  id="read-receipts"
                  checked={editedSettings.privacy.readReceipts}
                  onCheckedChange={(checked) =>
                    setEditedSettings({
                      ...editedSettings,
                      privacy: { ...editedSettings.privacy, readReceipts: checked },
                    })
                  }
                  className="transition-opacity data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="transition-colors hover:bg-muted active:scale-95"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting} className="transition-transform active:scale-95">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

