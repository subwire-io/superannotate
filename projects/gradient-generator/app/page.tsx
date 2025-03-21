import GradientGenerator from "@/components/gradient-generator"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Color Gradient Generator</h1>
        <GradientGenerator />
      </div>
    </main>
  )
}

