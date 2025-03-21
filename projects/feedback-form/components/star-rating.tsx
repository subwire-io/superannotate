"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
}

export function StarRating({ rating, onRatingChange }: StarRatingProps) {
  return (
    <div className="flex items-center space-x-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-1 rounded-md"
          onClick={() => onRatingChange(star)}
          aria-checked={rating === star}
          role="radio"
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Star
            className={cn(
              "h-8 w-8 transition-all duration-300",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-muted-foreground hover:text-yellow-400",
            )}
          />
        </motion.button>
      ))}
      <span className="sr-only">Selected rating: {rating}</span>
    </div>
  )
}

