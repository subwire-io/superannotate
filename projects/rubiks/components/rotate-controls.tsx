"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, RotateCw } from "lucide-react"

interface RotateControlsProps {
  onRotate: (face: string, direction: string) => void
}

export function RotateControls({ onRotate }: RotateControlsProps) {
  return (
    <div className="bg-background/80 p-4 rounded-lg flex flex-col items-center gap-2">
      <div className="text-sm font-medium mb-2">Rotate Faces</div>

      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="icon" onClick={() => onRotate("left", "up")} className="h-10 w-10">
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">Rotate left face up</span>
        </Button>

        <Button variant="outline" size="icon" onClick={() => onRotate("front", "up")} className="h-10 w-10">
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">Rotate front face up</span>
        </Button>

        <Button variant="outline" size="icon" onClick={() => onRotate("right", "up")} className="h-10 w-10">
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">Rotate right face up</span>
        </Button>

        <Button variant="outline" size="icon" onClick={() => onRotate("left", "left")} className="h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Rotate left face left</span>
        </Button>

        <Button variant="outline" size="icon" onClick={() => onRotate("top", "clockwise")} className="h-10 w-10">
          <RotateCw className="h-5 w-5" />
          <span className="sr-only">Rotate top face clockwise</span>
        </Button>

        <Button variant="outline" size="icon" onClick={() => onRotate("right", "right")} className="h-10 w-10">
          <ArrowRight className="h-5 w-5" />
          <span className="sr-only">Rotate right face right</span>
        </Button>

        <Button variant="outline" size="icon" onClick={() => onRotate("left", "down")} className="h-10 w-10">
          <ArrowDown className="h-5 w-5" />
          <span className="sr-only">Rotate left face down</span>
        </Button>

        <Button variant="outline" size="icon" onClick={() => onRotate("front", "down")} className="h-10 w-10">
          <ArrowDown className="h-5 w-5" />
          <span className="sr-only">Rotate front face down</span>
        </Button>

        <Button variant="outline" size="icon" onClick={() => onRotate("right", "down")} className="h-10 w-10">
          <ArrowDown className="h-5 w-5" />
          <span className="sr-only">Rotate right face down</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Button variant="outline" size="sm" onClick={() => onRotate("bottom", "counterclockwise")} className="h-8">
          <RotateCcw className="h-4 w-4 mr-1" />
          <span>Bottom</span>
        </Button>

        <Button variant="outline" size="sm" onClick={() => onRotate("back", "clockwise")} className="h-8">
          <RotateCw className="h-4 w-4 mr-1" />
          <span>Back</span>
        </Button>
      </div>
    </div>
  )
}

