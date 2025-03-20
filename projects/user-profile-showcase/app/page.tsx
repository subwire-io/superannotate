import UserProfileCard from "@/components/user-profile-card"

export default function Home() {
  const users = [
    {
      name: "Olivia Martinez",
      jobTitle: "Senior Product Designer",
      avatarUrl: "/placeholder.svg?height=200&width=200",
      initials: "OM",
    },
    {
      name: "Alex Johnson",
      jobTitle: "Frontend Developer",
      avatarUrl: "/placeholder.svg?height=200&width=200",
      initials: "AJ",
    },
    {
      name: "Sarah Williams",
      jobTitle: "UX Researcher",
      initials: "SW",
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-2">User Profile Cards</h1>
          <p className="text-muted-foreground">A collection of user profile cards with different data</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <UserProfileCard
              key={index}
              name={user.name}
              jobTitle={user.jobTitle}
              avatarUrl={user.avatarUrl}
              initials={user.initials}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

