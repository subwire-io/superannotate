"use client"

import { useState, useEffect } from "react"
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

// Type definitions
type WeatherData = {
  location: string
  temperature: number
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "snowy" | "partly-cloudy"
  high: number
  low: number
  humidity: number
  windSpeed: number
}

type Activity = {
  id: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  action: string
  target: string
  timestamp: string
  status?: "pending" | "completed" | "failed"
}

type Message = {
  id: string
  sender: {
    name: string
    avatar?: string
    initials: string
  }
  content: string
  timestamp: string
  read: boolean
}

type Document = {
  id: string
  title: string
  content: string
  lastModified: string
}

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

// Mock data
const weatherData: WeatherData = {
  location: "New York, NY",
  temperature: 72,
  condition: "partly-cloudy",
  high: 78,
  low: 65,
  humidity: 45,
  windSpeed: 8,
}

const initialActivities: Activity[] = [
  {
    id: "1",
    user: {
      name: "Alex Johnson",
      initials: "AJ",
    },
    action: "commented on",
    target: "Project Outline",
    timestamp: "5 minutes ago",
    status: "completed",
  },
  {
    id: "2",
    user: {
      name: "Sarah Miller",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SM",
    },
    action: "uploaded",
    target: "Q3 Financial Report.pdf",
    timestamp: "1 hour ago",
    status: "completed",
  },
  {
    id: "3",
    user: {
      name: "David Chen",
      initials: "DC",
    },
    action: "assigned",
    target: "Website Redesign Task",
    timestamp: "3 hours ago",
    status: "pending",
  },
  {
    id: "4",
    user: {
      name: "Emily Wang",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "EW",
    },
    action: "scheduled",
    target: "Team Meeting",
    timestamp: "Yesterday at 4:30 PM",
    status: "completed",
  },
  {
    id: "5",
    user: {
      name: "Michael Brown",
      initials: "MB",
    },
    action: "shared",
    target: "Marketing Strategy",
    timestamp: "Yesterday at 11:20 AM",
    status: "completed",
  },
]

const initialMessages: Message[] = [
  {
    id: "1",
    sender: {
      name: "Jane Miller",
      initials: "JM",
    },
    content: "Hi, could you review the latest design files I sent?",
    timestamp: "10m",
    read: false,
  },
  {
    id: "2",
    sender: {
      name: "Robert Wilson",
      avatar: "/placeholder.svg?height=40&width=40&text=RW",
      initials: "RW",
    },
    content: "The meeting has been rescheduled to 3pm tomorrow.",
    timestamp: "2h",
    read: true,
  },
  {
    id: "3",
    sender: {
      name: "Anna Smith",
      initials: "AS",
    },
    content: "Just finished the project report, take a look when you can.",
    timestamp: "1d",
    read: true,
  },
]

const initialDocuments: Document[] = [
  {
    id: "1",
    title: "Q3 Strategy.pdf",
    content: "This document outlines our strategy for Q3...",
    lastModified: "Modified 2 days ago",
  },
  {
    id: "2",
    title: "Project Brief.docx",
    content: "Project brief for the new website redesign...",
    lastModified: "Modified 5 days ago",
  },
  {
    id: "3",
    title: "Team Roster.xlsx",
    content: "Current team roster with contact information...",
    lastModified: "Modified 1 week ago",
  },
]

const initialLinks = [
  { icon: <Globe className="h-4 w-4" />, name: "Company Wiki", url: "https://wiki.example.com" },
  { icon: <Calendar className="h-4 w-4" />, name: "Team Calendar", url: "https://calendar.example.com" },
  { icon: <FileText className="h-4 w-4" />, name: "Documentation", url: "https://docs.example.com" },
]

const userProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  initials: "JD",
  avatar: "/placeholder.svg?height=32&width=32",
  role: "Product Manager",
  department: "Product",
  location: "New York, NY",
  bio: "Passionate about building great products and leading teams.",
}

const userSettings: UserSettings = {
  notifications: {
    email: true,
    push: true,
    sms: false,
    inApp: true,
  },
  appearance: {
    theme: "system",
    density: "comfortable" | "spacious",
    animations: true,
  },
  privacy: {
    profileVisibility: "team",
    activityStatus: true,
    readReceipts: true,
  },
}

// Helper function to get weather icon based on condition
function getWeatherIcon(condition: WeatherData["condition"]) {
  switch (condition) {
    case "sunny":
      return <Sun className="h-8 w-8 text-amber-500" aria-hidden="true" />
    case "cloudy":
      return <Cloud className="h-8 w-8 text-gray-500" aria-hidden="true" />
    case "rainy":
      return <CloudRain className="h-8 w-8 text-blue-500" aria-hidden="true" />
    case "stormy":
      return <CloudLightning className="h-8 w-8 text-purple-500" aria-hidden="true" />
    case "snowy":
      return <CloudSnow className="h-8 w-8 text-blue-300" aria-hidden="true" />
    case "partly-cloudy":
      return <CloudDrizzle className="h-8 w-8 text-blue-400" aria-hidden="true" />
    default:
      return <Cloud className="h-8 w-8" aria-hidden="true" />
  }
}

// Status badge component
function StatusBadge({ status }: { status?: Activity["status"] }) {
  if (!status) return null

  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
          Completed
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
          Pending
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
          Failed
        </Badge>
      )
    default:
      return null
  }
}

export default function Dashboard() {
  // State management
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Handle sending a new message
  const handleSendMessage = (message: any) => {
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

    setMessages([newMessage, ...messages])

    toast({
      title: "Message Sent",
      description: `Your message to ${message.recipient.name} has been sent.`,
    })
  }

  // Handle creating a new document
  const handleCreateDocument = (document: any) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title: document.title,
      content: document.content,
      lastModified: "Just now",
    }

    setDocuments([newDocument, ...documents])

    // Add a new activity for document creation
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

    setActivities([newActivity, ...activities])

    toast({
      title: "Document Created",
      description: `Your document "${document.title}" has been created.`,
    })
  }

  // Handle scheduling a meeting
  const handleScheduleMeeting = async () => {
    setIsLoading({ ...isLoading, schedule: true })

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

      setActivities([newActivity, ...activities])

      toast({
        title: "Meeting Scheduled",
        description: "Your team meeting has been scheduled.",
      })
    } finally {
      setIsLoading({ ...isLoading, schedule: false })
    }
  }

  // Handle team action
  const handleTeamAction = async () => {
    setIsLoading({ ...isLoading, team: true })

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

      setActivities([newActivity, ...activities])

      toast({
        title: "Team Action",
        description: "You've invited a new team member.",
      })
    } finally {
      setIsLoading({ ...isLoading, team: false })
    }
  }

  // Handle updating profile
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile)

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
  }

  // Handle updating settings
  const handleUpdateSettings = (updatedSettings: UserSettings) => {
    setSettings(updatedSettings)

    toast({
      title: "Settings Updated",
      description: "Your settings have been updated successfully.",
    })
  }

  // Handle downloading a document
  const handleDownloadDocument = (document: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading "${document.title}"...`,
    })
  }

  // Handle opening a link
  const handleOpenLink = (link: { name: string; url: string }) => {
    window.open(link.url, "_blank")

    toast({
      title: "Opening Link",
      description: `Opening ${link.name} in a new tab.`,
    })
  }

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!itemToDelete) return

    const { type, id } = itemToDelete

    if (type === "document") {
      const documentToDelete = documents.find((doc) => doc.id === id)
      if (documentToDelete) {
        setDeletedItems([...deletedItems, { type, item: documentToDelete }])
        setDocuments(documents.filter((doc) => doc.id !== id))

        toast({
          title: "Document Deleted",
          description: `"${documentToDelete.title}" has been deleted.`,
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUndo({ type, item: documentToDelete })}
              className="hover:bg-muted"
            >
              Undo
            </Button>
          ),
        })
      }
    } else if (type === "message") {
      const messageToDelete = messages.find((msg) => msg.id === id)
      if (messageToDelete) {
        setDeletedItems([...deletedItems, { type, item: messageToDelete }])
        setMessages(messages.filter((msg) => msg.id !== id))

        toast({
          title: "Message Deleted",
          description: "The message has been deleted.",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUndo({ type, item: messageToDelete })}
              className="hover:bg-muted"
            >
              Undo
            </Button>
          ),
        })
      }
    } else if (type === "activity") {
      const activityToDelete = activities.find((act) => act.id === id)
      if (activityToDelete) {
        setDeletedItems([...deletedItems, { type, item: activityToDelete }])
        setActivities(activities.filter((act) => act.id !== id))

        toast({
          title: "Activity Deleted",
          description: "The activity has been removed from your history.",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUndo({ type, item: activityToDelete })}
              className="hover:bg-muted"
            >
              Undo
            </Button>
          ),
        })
      }
    }

    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  // Handle undo delete
  const handleUndo = ({ type, item }: { type: "document" | "message" | "activity"; item: any }) => {
    if (type === "document") {
      setDocuments([item, ...documents])
    } else if (type === "message") {
      setMessages([item, ...messages])
    } else if (type === "activity") {
      setActivities([item, ...activities])
    }

    setDeletedItems(
      deletedItems.filter((deletedItem) => !(deletedItem.type === type && deletedItem.item.id === item.id)),
    )

    toast({
      title: "Item Restored",
      description: "The deleted item has been restored.",
    })
  }

  // Handle delete request
  const handleDeleteRequest = (type: "document" | "message" | "activity", id: string) => {
    setItemToDelete({ type, id })
    setDeleteDialogOpen(true)
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setMessages(messages.map((message) => ({ ...message, read: true })))

    toast({
      title: "Notifications Cleared",
      description: "All notifications have been marked as read.",
    })

    setNotificationsOpen(false)
  }

  // Add keyboard shortcut event listeners
  // Add this inside the Dashboard component, right after the state declarations
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
            // We'd need a ref to trigger it programmatically
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isLoading, handleScheduleMeeting, handleTeamAction])

  return (
    <div className={`min-h-screen bg-background ${darkMode ? "dark" : ""}`}>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-16 items-center px-4 sm:px-6">
            <div className="flex items-center gap-2 font-semibold">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <KeyboardShortcutsDialog />
              <div className="flex items-center gap-2">
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                  aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
                  className="transition-opacity data-[state=checked]:bg-primary"
                />
                <Label htmlFor="dark-mode" className="sr-only">
                  Toggle dark mode
                </Label>
                {darkMode ? (
                  <Moon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Show notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative transition-colors hover:bg-muted active:scale-95"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {messages.some((msg) => !msg.read) && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full transition-colors hover:bg-muted active:scale-95"
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
                    className="cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSettingsOpen(true)}
                    className="cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  >
                    <Cog className="mr-2 h-4 w-4" />
                    <span>Settings</span>
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
            <Card className="overflow-hidden transition-shadow hover:shadow-md">
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
            <Card className="overflow-hidden transition-shadow hover:shadow-md md:col-span-2 lg:col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activities</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="transition-colors hover:bg-muted active:scale-95">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setAllActivitiesOpen(true)}
                        className="cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                      >
                        View all
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-muted focus:bg-muted">
                        Mark all as read
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {activities.length > 0 ? (
                  <div className="space-y-0 divide-y" role="log" aria-live="polite" aria-label="Recent activities">
                    {activities.slice(0, 5).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            {activity.user.avatar ? (
                              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                            ) : null}
                            <AvatarFallback>{activity.user.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {activity.user.name} <span className="text-muted-foreground">{activity.action}</span>{" "}
                              {activity.target}
                              <StatusBadge status={activity.status} />
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted active:scale-95"
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
                  className="w-full transition-colors hover:bg-muted active:scale-95"
                  onClick={() => setAllActivitiesOpen(true)}
                >
                  View all activities
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Actions Widget */}
            <Card className="overflow-hidden transition-shadow hover:shadow-md">
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
                      icon: <FileText className="h-6 w-6 text-primary" aria-hidden="true" />,
                      onClick: () => setNewDocumentOpen(true),
                      disabled: false,
                    },
                    {
                      id: "send-message",
                      label: "Send Message",
                      icon: <MessageSquare className="h-6 w-6 text-primary" aria-hidden="true" />,
                      onClick: () => setNewMessageOpen(true),
                      disabled: false,
                    },
                    {
                      id: "schedule",
                      label: isLoading.schedule ? "Scheduling..." : "Schedule",
                      icon: isLoading.schedule ? (
                        <Loader2 className="h-6 w-6 text-primary animate-spin" aria-hidden="true" />
                      ) : (
                        <Calendar className="h-6 w-6 text-primary" aria-hidden="true" />
                      ),
                      onClick: handleScheduleMeeting,
                      disabled: isLoading.schedule,
                    },
                    {
                      id: "team",
                      label: isLoading.team ? "Processing..." : "Team",
                      icon: isLoading.team ? (
                        <Loader2 className="h-6 w-6 text-primary animate-spin" aria-hidden="true" />
                      ) : (
                        <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                      ),
                      onClick: handleTeamAction,
                      disabled: isLoading.team,
                    },
                  ]}
                />
              </CardContent>
            </Card>

            {/* Messages Widget */}
            <Card className="overflow-hidden transition-shadow hover:shadow-md">
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
                  className="transition-colors hover:bg-muted active:scale-95"
                  onClick={() => setAllMessagesOpen(true)}
                >
                  View all
                </Button>
                <Button
                  size="sm"
                  className="transition-transform active:scale-95"
                  onClick={() => setNewMessageOpen(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  New Message
                </Button>
              </CardFooter>
            </Card>

            {/* Stats Widget */}
            <Card className="overflow-hidden transition-shadow hover:shadow-md">
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
            <Card className="overflow-hidden transition-shadow hover:shadow-md">
              <Tabs defaultValue="files">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle>Quick Access</CardTitle>
                    <TabsList>
                      <TabsTrigger
                        value="files"
                        className="transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Files
                      </TabsTrigger>
                      <TabsTrigger
                        value="links"
                        className="transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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
                          className="flex items-center justify-between hover:bg-muted/50 transition-colors duration-200 p-2 rounded-md group"
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
                              className="transition-colors hover:bg-muted active:scale-95"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Delete ${file.title}`}
                              onClick={() => handleDeleteRequest("document", file.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted active:scale-95"
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
                      links.map((link, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between hover:bg-muted/50 transition-colors duration-200 p-2 rounded-md"
                        >
                          <div className="flex items-center gap-3">
                            {link.icon}
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
                            className="transition-colors hover:bg-muted active:scale-95"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
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
              className="h-auto p-1 transition-colors hover:bg-muted active:scale-95"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-y-auto">
            {activities.length > 0 ? (
              activities.slice(0, 5).map((activity) => (
                <DropdownMenuItem
                  key={activity.id}
                  className="flex flex-col items-start p-3 cursor-default hover:bg-muted focus:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      {activity.user.avatar ? (
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      ) : null}
                      <AvatarFallback className="text-xs">{activity.user.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{activity.user.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.action} {activity.target}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">No notifications to display</div>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="justify-center cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
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

