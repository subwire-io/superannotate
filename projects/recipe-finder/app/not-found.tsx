import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Recipe Not Found</h2>
      <p className="text-muted-foreground mb-8">We couldn't find the recipe you were looking for.</p>
      <Button asChild>
        <Link href="/">Return to Recipe Finder</Link>
      </Button>
    </div>
  )
}

