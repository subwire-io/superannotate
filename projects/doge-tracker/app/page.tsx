import PriceTracker from "@/components/price-tracker"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Dogecoin Price Tracker</h1>
      <PriceTracker />
    </main>
  )
}

