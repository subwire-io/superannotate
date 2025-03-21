import RealEstateListing from "@/components/real-estate-listing"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <RealEstateListing />
      <Toaster />
    </main>
  )
}

