import UserProfileCard from "@/components/user-profile-card"

export default function Home() {
  const users = [
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

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold mb-3">User Profile Cards</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A collection of user profile cards with different data
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div className="col-span-full text-center py-16 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground text-lg">No user profiles available</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

