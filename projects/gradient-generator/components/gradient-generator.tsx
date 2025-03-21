"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Preset gradients
const presets = [
  { name: "Sunset", startColor: "#FF512F", endColor: "#F09819" },
  { name: "Ocean", startColor: "#2E3192", endColor: "#1BFFFF" },
  { name: "Forest", startColor: "#134E5E", endColor: "#71B280" },
  { name: "Berry", startColor: "#8E2DE2", endColor: "#4A00E0" },
  { name: "Fire", startColor: "#FF416C", endColor: "#FF4B2B" },
]

export default function GradientGenerator() {
  const [startColor, setStartColor] = useState("#FF512F")
  const [endColor, setEndColor] = useState("#F09819")
  const [direction, setDirection] = useState("to right")

  // Generate CSS gradient style
  const gradientStyle = {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  }

  // Handle preset selection
  const handlePresetChange = (presetName: string) => {
    const preset = presets.find((p) => p.name === presetName)
    if (preset) {
      setStartColor(preset.startColor)
      setEndColor(preset.endColor)
    }
  }

  // CSS code to display
  const cssCode =
    direction === "circle"
      ? `background: radial-gradient(circle, ${startColor}, ${endColor});`
      : `background: linear-gradient(${direction}, ${startColor}, ${endColor});`

  return (
    <div className="space-y-6">
      {/* Gradient Preview with CSS Code */}
      <Card>
        <CardContent className="p-0">
          <div className="w-full h-48 rounded-t-md transition-all duration-500" style={gradientStyle} />
          <div className="p-4 bg-muted/30 border-t">
            <p className="font-mono text-sm overflow-x-auto">{cssCode}</p>
          </div>
        </CardContent>
      </Card>

      {/* Combined Controls Area */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="presets">
            <TabsList className="mb-4">
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-4">
              <RadioGroup
                defaultValue="Sunset"
                onValueChange={handlePresetChange}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {presets.map((preset) => (
                  <div key={preset.name} className="flex items-center space-x-2">
                    <RadioGroupItem value={preset.name} id={preset.name} />
                    <Label htmlFor={preset.name} className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full mr-2"
                        style={{ background: `linear-gradient(to right, ${preset.startColor}, ${preset.endColor})` }}
                      />
                      {preset.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="pt-2">
                <Label htmlFor="preset-direction">Direction</Label>
                <Select value={direction} onValueChange={setDirection}>
                  <SelectTrigger id="preset-direction" className="mt-1">
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to right">Horizontal</SelectItem>
                    <SelectItem value="to bottom">Vertical</SelectItem>
                    <SelectItem value="to bottom right">Diagonal</SelectItem>
                    <SelectItem value="to top right">Reverse Diagonal</SelectItem>
                    <SelectItem value="circle">Radial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Color */}
                <div className="space-y-2">
                  <Label htmlFor="startColor">Start Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: startColor }} />
                    <input
                      id="startColor"
                      type="color"
                      value={startColor}
                      onChange={(e) => setStartColor(e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>

                {/* End Color */}
                <div className="space-y-2">
                  <Label htmlFor="endColor">End Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: endColor }} />
                    <input
                      id="endColor"
                      type="color"
                      value={endColor}
                      onChange={(e) => setEndColor(e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
              </div>

              {/* Direction */}
              <div className="space-y-2">
                <Label htmlFor="custom-direction">Direction</Label>
                <Select value={direction} onValueChange={setDirection}>
                  <SelectTrigger id="custom-direction">
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to right">Horizontal</SelectItem>
                    <SelectItem value="to bottom">Vertical</SelectItem>
                    <SelectItem value="to bottom right">Diagonal</SelectItem>
                    <SelectItem value="to top right">Reverse Diagonal</SelectItem>
                    <SelectItem value="circle">Radial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

