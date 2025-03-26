import PacmanGame from "@/components/pacman-game"

export default function Home() {
  return (
    <main className="flex h-screen max-h-screen overflow-hidden flex-col items-center justify-start p-4 pt-2 bg-black">
      <h1 className="text-3xl font-bold text-yellow-400 m-0">Retro Arcade</h1>
      <div className="flex-1 flex items-center justify-center w-full">
        <PacmanGame />
      </div>
    </main>
  )
}

