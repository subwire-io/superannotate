"use client"

import { Button } from "@/components/ui/button"
import { Grid, Map } from "lucide-react"
import { motion } from "framer-motion"

interface ViewToggleProps {
  view: "grid" | "map"
  setView: (view: "grid" | "map") => void
}

export function ViewToggle({ view, setView }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-2 border rounded-md p-1 relative">
      <motion.div
        className="absolute inset-0 bg-accent rounded-sm z-0"
        initial={false}
        animate={{
          x: view === "grid" ? 0 : "100%",
          width: "50%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView("grid")}
        aria-label="Grid view"
        className="relative z-10 transition-colors hover:text-primary"
      >
        <Grid className="h-4 w-4 mr-2" />
        Grid
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView("map")}
        aria-label="Map view"
        className="relative z-10 transition-colors hover:text-primary"
      >
        <Map className="h-4 w-4 mr-2" />
        Map
      </Button>
    </div>
  )
}

