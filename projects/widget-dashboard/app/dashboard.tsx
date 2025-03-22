"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import {
  Bell,
  Calendar,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Cog,
  FileText,
  Home,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Download,
  Sun,
  User,
  Users,
  Wind,
  Mail,
  Globe,
  ExternalLink,
  Loader2,
  Trash2,
  Keyboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { EmptyState } from "@/components/empty-state"

// Import our custom dialogs
import { NewMessageDialog } from "@/components/new-message-dialog"
import { AllActivitiesDialog } from "@/components/all-activities-dialog"
import { AllMessagesDialog } from "@/components/all-messages-dialog"
import { ProfileDialog } from "@/components/profile-dialog"
import { SettingsDialog } from "@/components/settings-dialog"
import { DocumentDialog } from "@/components/document-dialog"
import { KeyboardShortcutsDialog } from "@/components/keyboard-shortcuts-dialog"
import { KeyboardAccessibleActions } from "@/components/keyboard-accessible-actions"
import { KeyboardAccessibleMessageList } from "@/components/keyboard-accessible-message-list"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { useDebounce } from "@/hooks/use-debounce"
import { useThrottle } from "@/hooks/use-throttle"
import { createTransition } from "@/lib/animation-config"

// Import types and mock data
import type { WeatherData, Activity, Message, Document, UserProfile, UserSettings } from "@/types"
import {
  weatherData,
  initialActivities,
  initialMessages,
  initialDocuments,
  initialLinks,
  userProfile,
  userSettings,
} from "@/data/mock-data"

// Helper function to get weather icon based on condition
function getWeatherIcon(condition: WeatherData["condition"]) {
  switch (condition) {
    case "sunny":
      return <Sun className="h-8 w-8 text-amber-500 hardware-accelerated" aria-hidden="true" />
    case "cloudy":
      return <Cloud className="h-8 w-8 text-gray-500 hardware-accelerated" aria-hidden="true" />
    case "rainy":
      return <CloudRain className="h-8 w-8 text-blue-500 hardware-accelerated" aria-hidden="true" />
    case "stormy":
      return <CloudLightning className="h-8 w-8 text-purple-500 hardware-accelerated" aria-hidden="true" />
    case "snowy":
      return <CloudSnow className="h-8 w-8 text-blue-300 hardware-accelerated" aria-hidden="true" />
    case "partly-cloudy":
      return <CloudDrizzle className="h-8 w-8 text-blue-400 hardware-accelerated" aria-hidden="true" />
    default:
      return <Cloud className="h-8 w-8 hardware-accelerated" aria-hidden="true" />
  }
}

// Status badge component
function StatusBadge({ status }: { status?: Activity["status"] }) {
  if (!status) return null

  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 text-xs">
          Completed
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
          Pending
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200 text-xs">
          Failed
        </Badge>
      )
    default:
      return null
  }
}

export default function Dashboard() {
  // Refs for performance optimization
  const animationFrameRef = useRef<number | null>(null)
  const renderCountRef = useRef(0)

  // State management with memoization
  const [darkMode, setDarkMode] = useState(false)
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [links, setLinks] = useState(initialLinks)
  const [profile, setProfile] = useState<UserProfile>(userProfile)
  const [settings, setSettings] = useState<UserSettings>(userSettings)
  const [deletedItems, setDeletedItems] = useState<
    {
      type: "document" | "message" | "activity"
      item: any
    }[]
  >([])

  // Dialog states
  const [newMessageOpen, setNewMessageOpen] = useState(false)
  const [allActivitiesOpen, setAllActivitiesOpen] = useState(false)
  const [allMessagesOpen, setAllMessagesOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [newDocumentOpen, setNewDocumentOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Alert dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{
    type: "document" | "message" | "activity"
    id: string
  } | null>(null)

  // Loading states
  const [isLoading, setIsLoading] = useState<{
    [key: string]: boolean
  }>({})

  const { toast } = useToast()

  // Debounce state changes to prevent UI glitches
  const debouncedDarkMode = useDebounce(darkMode, 10)

  // Memoize expensive calculations
  const unreadMessageCount = useMemo(() => {
    return messages.filter((msg) => !msg.read).length
  }, [messages])

  // Toggle dark mode with optimized rendering
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev)

    // Use requestAnimationFrame for smoother transitions
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (!darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      animationFrameRef.current = null
    })
  }, [darkMode])

  // Handle sending a new message with optimized state updates
  const handleSendMessage = useCallback(
    (message: any) => {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: {
          name: message.recipient.name,
          avatar: message.recipient.avatar,
          initials: message.recipient.initials,
        },
        content: message.content,
        timestamp: "Just now",
        read: false,
      }

      setMessages((prev) => [newMessage, ...prev])

      toast({
        title: "Message Sent",
        description: `Your message to ${message.recipient.name} has been sent.`,
      })
    },
    [toast],
  )

  // Handle creating a new document with optimized state updates
  const handleCreateDocument = useCallback(
    (document: any) => {
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        title: document.title,
        content: document.content,
        lastModified: "Just now",
      }

      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        user: {
          name: profile.name,
          avatar: profile.avatar,
          initials: profile.initials,
        },
        action: "created",
        target: document.title,
        timestamp: "Just now",
        status: "completed",
      }

      // Batch state updates for better performance
      requestAnimationFrame(() => {
        setDocuments((prev) => [newDocument, ...prev])
        setActivities((prev) => [newActivity, ...prev])
      })

      toast({
        title: "Document Created",
        description: `Your document "${document.title}" has been created.`,
      })
    },
    [profile, toast],
  )

  // Handle scheduling a meeting with throttling
  const handleScheduleMeeting = useThrottle(async () => {
    setIsLoading((prev) => ({ ...prev, schedule: true }))

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add a new activity for scheduling a meeting
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        user: {
          name: profile.name,
          avatar: profile.avatar,
          initials: profile.initials,
        },
        action: "scheduled",
        target: "Team Meeting",
        timestamp: "Just now",
        status: "pending",
      }

      setActivities((prev) => [newActivity, ...prev])

      toast({
        title: "Meeting Scheduled",
        description: "Your team meeting has been scheduled.",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, schedule: false }))
    }
  }, 500)

  // Handle team action with throttling
  const handleTeamAction = useThrottle(async () => {
    setIsLoading((prev) => ({ ...prev, team: true }))

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add a new activity for team action
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        user: {
          name: profile.name,
          avatar: profile.avatar,
          initials: profile.initials,
        },
        action: "invited",
        target: "New Team Member",
        timestamp: "Just now",
        status: "pending",
      }

      setActivities((prev) => [newActivity, ...prev])

      toast({
        title: "Team Action",
        description: "You've invited a new team member.",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, team: false }))
    }
  }, 500)

  // Handle updating profile with optimized state updates
  const handleUpdateProfile = useCallback(
    (updatedProfile: UserProfile) => {
      setProfile(updatedProfile)

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    },
    [toast],
  )

  // Handle updating settings with optimized state updates
  const handleUpdateSettings = useCallback(
    (updatedSettings: UserSettings) => {
      setSettings(updatedSettings)

      toast({
        title: "Settings Updated",
        description: "Your settings have been updated successfully.",
      })
    },
    [toast],
  )

  // Handle downloading a document
  const handleDownloadDocument = useCallback(
    (document: Document) => {
      toast({
        title: "Download Started",
        description: `Downloading "${document.title}"...`,
      })
    },
    [toast],
  )

  // Handle opening a link
  const handleOpenLink = useCallback(
    (link: { name: string; url: string; iconType: string }) => {
      window.open(link.url, "_blank")

      toast({
        title: "Opening Link",
        description: `Opening ${link.name} in a new tab.`,
      })
    },
    [toast],
  )

  // Handle delete confirmation with optimized state updates
  const handleDeleteConfirm = useCallback(() => {
    if (!itemToDelete) return

    const { type, id } = itemToDelete

    if (type === "document") {
      const documentToDelete = documents.find((doc) => doc.id === id)
      if (documentToDelete) {
        // Batch state updates
        requestAnimationFrame(() => {
          setDeletedItems((prev) => [...prev, { type, item: documentToDelete }])
          setDocuments((prev) => prev.filter((doc) => doc.id !== id))
        })

        toast({
          title: "Document Deleted",
          description: `"${documentToDelete.title}" has been deleted.`,
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUndo({ type, item: documentToDelete })}
              className="hover:bg-muted hardware-accelerated"
              style={{ transition: createTransition(["background-color", "transform"]) }}
            >
              Undo
            </Button>
          ),
        })
      }
    } else if (type === "message") {
      const messageToDelete = messages.find((msg) => msg.id === id)
      if (messageToDelete) {
        // Batch state updates
        requestAnimationFrame(() => {
          setDeletedItems((prev) => [...prev, { type, item: messageToDelete }])
          setMessages((prev) => prev.filter((msg) => msg.id !== id))
        })

        toast({
          title: "Message Deleted",
          description: "The message has been deleted.",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUndo({ type, item: messageToDelete })}
              className="hover:bg-muted hardware-accelerated"
              style={{ transition: createTransition(["background-color", "transform"]) }}
            >
              Undo
            </Button>
          ),
        })
      }
    } else if (type === "activity") {
      const activityToDelete = activities.find((act) => act.id === id)
      if (activityToDelete) {
        // Batch state updates
        requestAnimationFrame(() => {
          setDeletedItems((prev) => [...prev, { type, item: activityToDelete }])
          setActivities((prev) => prev.filter((act) => act.id !== id))
        })

        toast({
          title: "Activity Deleted",
          description: "The activity has been removed from your history.",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUndo({ type, item: activityToDelete })}
              className="hover:bg-muted hardware-accelerated"
              style={{ transition: createTransition(["background-color", "transform"]) }}
            >
              Undo
            </Button>
          ),
        })
      }
    }

    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }, [itemToDelete, documents, messages, activities, toast])

  // Handle undo delete with optimized state updates
  const handleUndo = useCallback(
    ({ type, item }: { type: "document" | "message" | "activity"; item: any }) => {
      // Batch state updates
      requestAnimationFrame(() => {
        if (type === "document") {
          setDocuments((prev) => [item, ...prev])
        } else if (type === "message") {
          setMessages((prev) => [item, ...prev])
        } else if (type === "activity") {
          setActivities((prev) => [item, ...prev])
        }

        setDeletedItems((prev) =>
          prev.filter((deletedItem) => !(deletedItem.type === type && deletedItem.item.id === item.id)),
        )
      })

      toast({
        title: "Item Restored",
        description: "The deleted item has been restored.",
      })
    },
    [toast],
  )

  // Handle delete request
  const handleDeleteRequest = useCallback((type: "document" | "message" | "activity", id: string) => {
    setItemToDelete({ type, id })
    setDeleteDialogOpen(true)
  }, [])

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(() => {
    setMessages((prev) => prev.map((message) => ({ ...message, read: true })))

    toast({
      title: "Notifications Cleared",
      description: "All notifications have been marked as read.",
    })

    setNotificationsOpen(false)
  }, [toast])

  // Add keyboard shortcut event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Alt key is pressed and not inside an input or textarea
      if (e.altKey && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault()
            setNewMessageOpen(true)
            break
          case "d":
            e.preventDefault()
            setNewDocumentOpen(true)
            break
          case "s":
            e.preventDefault()
            if (!isLoading.schedule) handleScheduleMeeting()
            break
          case "t":
            e.preventDefault()
            if (!isLoading.team) handleTeamAction()
            break
          case "p":
            e.preventDefault()
            setProfileOpen(true)
            break
          case "k":
            e.preventDefault()
            // This would open the keyboard shortcuts dialog
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isLoading, handleScheduleMeeting, handleTeamAction])

  // Performance monitoring
  useEffect(() => {
    renderCountRef.current += 1
    console.log(`Dashboard render count: ${renderCountRef.current}`)

    return () => {
      // Clean up any animations on unmount
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div
      className={`min-h-screen bg-background ${debouncedDarkMode ? "dark" : ""}`}
      style={{ transition: createTransition(["background-color", "color"], "slow") }}
    >
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 border-b bg-background hardware-accelerated">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2 font-semibold">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block">
                <KeyboardShortcutsDialog />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                  aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
                  className="transition-opacity data-[state=checked]:bg-primary hardware-accelerated"
                />
                <Label htmlFor="dark-mode" className="sr-only">
                  Toggle dark mode
                </Label>
                {darkMode ? (
                  <Moon className="h-4 w-4 text-muted-foreground hardware-accelerated" aria-hidden="true" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground hardware-accelerated" aria-hidden="true" />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Show notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative transition-colors hover:bg-muted active:scale-95 hardware-accelerated"
                style={{ transition: createTransition(["background-color", "transform"]) }}
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadMessageCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full transition-colors hover:bg-muted active:scale-95 hardware-accelerated"
                    style={{ transition: createTransition(["background-color", "transform"]) }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback>{profile.initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setProfileOpen(true)}
                    className="cursor-pointer transition-colors hover:bg-muted focus:bg-muted hardware-accelerated"
                    style={{ transition: createTransition(["background-color"]) }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSettingsOpen(true)}
                    className="cursor-pointer transition-colors hover:bg-muted focus:bg-muted hardware-accelerated"
                    style={{ transition: createTransition(["background-color"]) }}
                  >
                    <Cog className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="sm:hidden cursor-pointer transition-colors hover:bg-muted focus:bg-muted hardware-accelerated"
                    style={{ transition: createTransition(["background-color"]) }}
                    onClick={() => {
                      // This would open the keyboard shortcuts dialog
                    }}
                  >
                    <Keyboard className="mr-2 h-4 w-4" />
                    <span>Keyboard Shortcuts</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 space-y-6 p-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile.name}! Here's an overview of your workspace.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Weather Widget */}
            <Card
              className="overflow-hidden transition-shadow hover:shadow-md hardware-accelerated"
              style={{ transition: createTransition(["box-shadow"]) }}
            >
              <CardHeader className="pb-2">
                <CardTitle>Weather</CardTitle>
                <CardDescription>{weatherData.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(weatherData.condition)}
                    <div>
                      <p className="text-3xl font-bold">{weatherData.temperature}°</p>
                      <p className="capitalize text-muted-foreground">{weatherData.condition.replace("-", " ")}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>H: {weatherData.high}°</div>
                    <div>L: {weatherData.low}°</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span>Humidity: {weatherData.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span>Wind: {weatherData.windSpeed} mph</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities Widget */}
            <Card
              className="overflow-hidden transition-shadow hover:shadow-md md:col-span-2 lg:col-span-1 hardware-accelerated"
              style={{ transition: createTransition(["box-shadow"]) }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activities</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="transition-colors hover:bg-muted active:scale-95 hardware-accelerated"
                        style={{ transition: createTransition(["background-color", "transform"]) }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setAllActivitiesOpen(true)}
                        className="cursor-pointer transition-colors hover:bg-muted focus:bg-muted hardware-accelerated"
                        style={{ transition: createTransition(["background-color"]) }}
                      >
                        View all
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer transition-colors hover:bg-muted focus:bg-muted hardware-accelerated"
                        style={{ transition: createTransition(["background-color"]) }}
                      >
                        Mark all as read
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {activities.length > 0 ? (
                  <div className="space-y-0 divide-y" role="log" aria-live="polite" aria-label="Recent activities">
                    {activities.slice(0, 5).map((activity, index) => (
                      <div
                        key={activity.id}
                        className="flex items-start justify-between px-4 sm:px-6 py-3 hover:bg-muted/50 transition-colors duration-200 stagger-item hardware-accelerated group"
                        style={{
                          transition: createTransition(["background-color"]),
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <div className="flex flex-1 min-w-0">
                          <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                            {activity.user.avatar ? (
                              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                            ) : null}
                            <AvatarFallback>{activity.user.initials}</AvatarFallback>
                          </Avatar>
                          <div className="ml-3 min-w-0 flex-1">
                            <div className="text-sm font-medium">
                              <span className="mr-1 truncate">{activity.user.name}</span>
                              <span className="text-muted-foreground">{activity.action}</span>{" "}
                              <span className="truncate">{activity.target}</span>
                            </div>
                            <div className="flex items-center mt-0.5">
                              <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                              {activity.status && <StatusBadge status={activity.status} />}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted active:scale-95 ml-2 hardware-accelerated"
                          style={{ transition: createTransition(["opacity", "background-color", "transform"]) }}
                          onClick={() => handleDeleteRequest("activity", activity.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Delete activity</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Calendar}
                    title="No activities yet"
                    description="Activities will appear here as you and your team work"
                    className="py-12"
                  />
                )}
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full transition-colors hover:bg-muted active:scale-95 hardware-accelerated"
                  style={{ transition: createTransition(["background-color", "transform"]) }}
                  onClick={() => setAllActivitiesOpen(true)}
                >
                  View all activities
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Actions Widget */}
            <Card
              className="overflow-hidden transition-shadow hover:shadow-md hardware-accelerated"
              style={{ transition: createTransition(["box-shadow"]) }}
            >
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Commonly used functions and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <KeyboardAccessibleActions
                  actions={[
                    {
                      id: "new-document",
                      label: "New Document",
                      icon: <FileText className="h-6 w-6 text-primary hardware-accelerated" aria-hidden="true" />,
                      onClick: () => setNewDocumentOpen(true),
                      disabled: false,
                    },
                    {
                      id: "send-message",
                      label: "Send Message",
                      icon: <MessageSquare className="h-6 w-6 text-primary hardware-accelerated" aria-hidden="true" />,
                      onClick: () => setNewMessageOpen(true),
                      disabled: false,
                    },
                    {
                      id: "schedule",
                      label: isLoading.schedule ? "Scheduling..." : "Schedule",
                      icon: isLoading.schedule ? (
                        <Loader2
                          className="h-6 w-6 text-primary animate-spin hardware-accelerated"
                          aria-hidden="true"
                        />
                      ) : (
                        <Calendar className="h-6 w-6 text-primary hardware-accelerated" aria-hidden="true" />
                      ),
                      onClick: handleScheduleMeeting,
                      disabled: isLoading.schedule,
                    },
                    {
                      id: "team",
                      label: isLoading.team ? "Processing..." : "Team",
                      icon: isLoading.team ? (
                        <Loader2
                          className="h-6 w-6 text-primary animate-spin hardware-accelerated"
                          aria-hidden="true"
                        />
                      ) : (
                        <Users className="h-6 w-6 text-primary hardware-accelerated" aria-hidden="true" />
                      ),
                      onClick: handleTeamAction,
                      disabled: isLoading.team,
                    },
                  ]}
                />
              </CardContent>
            </Card>

            {/* Messages Widget */}
            <Card
              className="overflow-hidden transition-shadow hover:shadow-md hardware-accelerated"
              style={{ transition: createTransition(["box-shadow"]) }}
            >
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Recent conversations</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {messages.length > 0 ? (
                  <KeyboardAccessibleMessageList
                    messages={messages}
                    onDelete={(id) => handleDeleteRequest("message", id)}
                    onView={(id) => {
                      // View message functionality
                      const message = messages.find((msg) => msg.id === id)
                      if (message && !message.read) {
                        setMessages(messages.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)))
                      }
                    }}
                  />
                ) : (
                  <EmptyState
                    icon={Mail}
                    title="No messages yet"
                    description="Messages will appear here as you communicate with your team"
                    className="py-12"
                  />
                )}
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-3 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-colors hover:bg-muted active:scale-95 hardware-accelerated"
                  style={{ transition: createTransition(["background-color", "transform"]) }}
                  onClick={() => setAllMessagesOpen(true)}
                >
                  View all
                </Button>
                <Button
                  size="sm"
                  className="transition-transform active:scale-95 hardware-accelerated"
                  style={{ transition: createTransition(["transform"]) }}
                  onClick={() => setNewMessageOpen(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  New Message
                </Button>
              </CardFooter>
            </Card>

            {/* Stats Widget */}
            <Card
              className="overflow-hidden transition-shadow hover:shadow-md hardware-accelerated"
              style={{ transition: createTransition(["box-shadow"]) }}
            >
              <CardHeader>
                <CardTitle>Stats Overview</CardTitle>
                <CardDescription>Your activity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Projects</p>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <span className="mr-1">↑</span> 4% from last month
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Tasks</p>
                    <p className="text-2xl font-bold">42</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <span className="mr-1">↑</span> 8% from last month
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">18</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <span className="mr-1">↑</span> 12% from last month
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">7</p>
                    <p className="text-xs text-red-600 flex items-center">
                      <span className="mr-1">↓</span> 3% from last month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access / Shortcuts */}
            <Card
              className="overflow-hidden transition-shadow hover:shadow-md hardware-accelerated"
              style={{ transition: createTransition(["box-shadow"]) }}
            >
              <Tabs defaultValue="files">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle>Quick Access</CardTitle>
                    <TabsList>
                      <TabsTrigger
                        value="files"
                        className="transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hardware-accelerated"
                        style={{ transition: createTransition(["background-color", "color"]) }}
                      >
                        Files
                      </TabsTrigger>
                      <TabsTrigger
                        value="links"
                        className="transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hardware-accelerated"
                        style={{ transition: createTransition(["background-color", "color"]) }}
                      >
                        Links
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>
                <CardContent>
                  <TabsContent value="files" className="mt-4 space-y-4">
                    {documents.length > 0 ? (
                      documents.map((file, i) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between hover:bg-muted/50 transition-colors duration-200 p-2 rounded-md group hardware-accelerated"
                          style={{ transition: createTransition(["background-color"]) }}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4" />
                            <div>
                              <p className="text-sm font-medium">{file.title}</p>
                              <p className="text-xs text-muted-foreground">{file.lastModified}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Download ${file.title}`}
                              onClick={() => handleDownloadDocument(file)}
                              className="transition-colors hover:bg-muted active:scale-95 hardware-accelerated"
                              style={{ transition: createTransition(["background-color", "transform"]) }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Delete ${file.title}`}
                              onClick={() => handleDeleteRequest("document", file.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted active:scale-95 hardware-accelerated"
                              style={{ transition: createTransition(["opacity", "background-color", "transform"]) }}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState icon={FileText} title="No files yet" description="Your files will appear here" />
                    )}
                  </TabsContent>
                  <TabsContent value="links" className="mt-4 space-y-4">
                    {links.length > 0 ? (
                      links.map((link, i) => {
                        // Map string identifiers to actual React components
                        let IconComponent
                        switch (link.iconType) {
                          case "globe":
                            IconComponent = <Globe className="h-4 w-4" />
                            break
                          case "calendar":
                            IconComponent = <Calendar className="h-4 w-4" />
                            break
                          case "fileText":
                            IconComponent = <FileText className="h-4 w-4" />
                            break
                          default:
                            IconComponent = <Globe className="h-4 w-4" />
                        }

                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between hover:bg-muted/50 transition-colors duration-200 p-2 rounded-md hardware-accelerated"
                            style={{ transition: createTransition(["background-color"]) }}
                          >
                            <div className="flex items-center gap-3">
                              {IconComponent}
                              <div>
                                <p className="text-sm font-medium">{link.name}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[12rem]">{link.url}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Open ${link.name}`}
                              onClick={() => handleOpenLink(link)}
                              className="transition-colors hover:bg-muted active:scale-95 hardware-accelerated"
                              style={{ transition: createTransition(["background-color", "transform"]) }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })
                    ) : (
                      <EmptyState icon={Globe} title="No links yet" description="Your links will appear here" />
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <NewMessageDialog open={newMessageOpen} onOpenChange={setNewMessageOpen} onSend={handleSendMessage} />

      <AllActivitiesDialog open={allActivitiesOpen} onOpenChange={setAllActivitiesOpen} activities={activities} />

      <AllMessagesDialog
        open={allMessagesOpen}
        onOpenChange={setAllMessagesOpen}
        messages={messages.map((msg) => ({
          ...msg,
          sender: msg.sender,
        }))}
        onNewMessage={() => setNewMessageOpen(true)}
      />

      <ProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <DocumentDialog
        open={newDocumentOpen}
        onOpenChange={setNewDocumentOpen}
        onCreateDocument={handleCreateDocument}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete item"
        description="This action can be undone from the notification that appears."
        itemName={
          itemToDelete?.type === "document" ? documents.find((doc) => doc.id === itemToDelete.id)?.title : undefined
        }
      />

      {/* Notifications */}
      <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DropdownMenuTrigger asChild>
          <div className="hidden">Notifications</div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 transition-colors hover:bg-muted active:scale-95 hardware-accelerated"
              style={{ transition: createTransition(["background-color", "transform"]) }}
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-y-auto">
            {activities.length > 0 ? (
              activities.slice(0, 5).map((activity, index) => (
                <DropdownMenuItem
                  key={activity.id}
                  className="flex flex-col items-start p-3 cursor-default hover:bg-muted focus:bg-muted transition-colors stagger-item hardware-accelerated"
                  style={{
                    transition: createTransition(["background-color"]),
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-start gap-2 mb-1 w-full">
                    <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                      {activity.user.avatar ? (
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      ) : null}
                      <AvatarFallback className="text-xs">{activity.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 w-full">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-sm font-medium truncate">{activity.user.name}</span>
                        <span className="text-xs text-muted-foreground">{activity.action}</span>
                        <span className="text-xs truncate">{activity.target}</span>
                        {activity.status && (
                          <Badge variant="outline" className="ml-auto text-xs" size="sm">
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">No notifications to display</div>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="justify-center cursor-pointer hover:bg-muted focus:bg-muted transition-colors hardware-accelerated"
            style={{ transition: createTransition(["background-color"]) }}
            onClick={() => {
              setNotificationsOpen(false)
              setAllActivitiesOpen(true)
            }}
          >
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Toaster />
    </div>
  )
}

