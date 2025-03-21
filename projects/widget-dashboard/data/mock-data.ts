import type { WeatherData, Activity, Message, Document, UserProfile, UserSettings } from "@/types"

// Mock data
export const weatherData: WeatherData = {
  location: "New York, NY",
  temperature: 72,
  condition: "partly-cloudy",
  high: 78,
  low: 65,
  humidity: 45,
  windSpeed: 8,
}

export const initialActivities: Activity[] = [
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

export const initialMessages: Message[] = [
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

export const initialDocuments: Document[] = [
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

// Use string identifiers for icons instead of JSX
export const initialLinks = [
  { iconType: "globe", name: "Company Wiki", url: "https://wiki.example.com" },
  { iconType: "calendar", name: "Team Calendar", url: "https://calendar.example.com" },
  { iconType: "fileText", name: "Documentation", url: "https://docs.example.com" },
]

export const userProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  initials: "JD",
  avatar: "/placeholder.svg?height=32&width=32",
  role: "Product Manager",
  department: "Product",
  location: "New York, NY",
  bio: "Passionate about building great products and leading teams.",
}

export const userSettings: UserSettings = {
  notifications: {
    email: true,
    push: true,
    sms: false,
    inApp: true,
  },
  appearance: {
    theme: "system",
    density: "comfortable",
    animations: true,
  },
  privacy: {
    profileVisibility: "team",
    activityStatus: true,
    readReceipts: true,
  },
}

