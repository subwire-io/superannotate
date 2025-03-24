import CheckersGame from "@/components/checkers-game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 md:p-8 bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-6 text-center">Checkers Game</h1>
        <CheckersGame />
      </div>
    </main>
  )
}

