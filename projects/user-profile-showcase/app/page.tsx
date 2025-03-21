"use client"

import { useState, useEffect } from "react"
import UserProfileCard from "@/components/user-profile-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function Home() {
  const allUsers = [
    {
      id: 1,
      name: "Olivia Martinez",
      jobTitle: "Senior Product Designer",
      avatarUrl: "/placeholder.svg?height=200&width=200&text=OM&bg=6366f1&fg=ffffff",
      initials: "OM",
      bio: "Passionate about creating intuitive user experiences and solving complex design problems. Specializes in product design and user research.",
    },
    {
      id: 2,
      name: "Alex Johnson",
      jobTitle: "Frontend Developer",
      avatarUrl: "/placeholder.svg?height=200&width=200&text=AJ&bg=ec4899&fg=ffffff",
      initials: "AJ",
      bio: "Building beautiful interfaces with React and TypeScript. Loves creating accessible and performant web applications.",
    },
    {
      id: 3,
      name: "Sarah Williams",
      jobTitle: "UX Researcher",
      avatarUrl: "/placeholder.svg?height=200&width=200&text=SW&bg=14b8a6&fg=ffffff",
      initials: "SW",
      bio: "Dedicated to understanding user needs through qualitative and quantitative research. Passionate about inclusive design practices.",
    },
  ]

  const [users, setUsers] = useState(allUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (searchQuery) {
      const filteredUsers = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setUsers(filteredUsers)
      setHasSearched(true)
    } else {
      setUsers(allUsers)
      setHasSearched(false)
    }
  }, [searchQuery])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">User Profile Cards</h1>
          <p className="text-muted-foreground mb-6">A collection of user profile cards with different data</p>

          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder="Search by name or job title..."
              className="pl-10 focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search users"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.length > 0 ? (
            users.map((user) => (
              <UserProfileCard
                key={user.id}
                name={user.name}
                jobTitle={user.jobTitle}
                avatarUrl={user.avatarUrl}
                initials={user.initials}
                bio={user.bio}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
              {hasSearched ? (
                <div className="space-y-2">
                  <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                  <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-2">
                    Clear search
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No user profiles available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

