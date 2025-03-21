export type WeatherData = {
  location: string
  temperature: number
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "snowy" | "partly-cloudy"
  high: number
  low: number
  humidity: number
  windSpeed: number
}

export type Activity = {
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

export type Message = {
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

export type Document = {
  id: string
  title: string
  content: string
  lastModified: string
}

export type UserProfile = {
  name: string
  email: string
  avatar?: string
  initials: string
  role: string
  department: string
  location: string
  bio: string
}

export type UserSettings = {
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

// Add a type for the links with iconType
export type Link = {
  iconType: string
  name: string
  url: string
}

