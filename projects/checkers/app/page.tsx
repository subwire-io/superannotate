import CheckersGame from "@/components/checkers-game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Checkers Game</h1>
      <CheckersGame />
    </main>
  )
}

