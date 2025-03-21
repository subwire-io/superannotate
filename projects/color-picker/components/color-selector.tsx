"use client"

import { useState, useEffect } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

// Preset colors
const presetColors = [
  "#f44336", // Red
  "#e91e63", // Pink
  "#9c27b0", // Purple
  "#673ab7", // Deep Purple
  "#3f51b5", // Indigo
  "#2196f3", // Blue
  "#03a9f4", // Light Blue
  "#00bcd4", // Cyan
  "#009688", // Teal
  "#4caf50", // Green
  "#8bc34a", // Light Green
  "#cddc39", // Lime
  "#ffeb3b", // Yellow
  "#ffc107", // Amber
  "#ff9800", // Orange
  "#ff5722", // Deep Orange
  "#795548", // Brown
  "#9e9e9e", // Grey
  "#607d8b", // Blue Grey
  "#000000", // Black
  "#ffffff", // White
]

// Convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

// Convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

// Form schemas
const hexFormSchema = z.object({
  hexColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Must be a valid hex color (e.g., #FF0000)",
  }),
})

const rgbFormSchema = z.object({
  r: z.coerce.number().min(0).max(255),
  g: z.coerce.number().min(0).max(255),
  b: z.coerce.number().min(0).max(255),
})

export default function ColorSelector() {
  const [selectedColor, setSelectedColor] = useState("#3f51b5")
  const [rgbValues, setRgbValues] = useState({ r: 63, g: 81, b: 181 })
  const [copied, setCopied] = useState(false)
  const [colorFormat, setColorFormat] = useState<"hex" | "rgb">("hex")
  const { toast } = useToast()

  // Initialize forms
  const hexForm = useForm<z.infer<typeof hexFormSchema>>({
    resolver: zodResolver(hexFormSchema),
    defaultValues: {
      hexColor: "#3f51b5",
    },
  })

  const rgbForm = useForm<z.infer<typeof rgbFormSchema>>({
    resolver: zodResolver(rgbFormSchema),
    defaultValues: {
      r: 63,
      g: 81,
      b: 181,
    },
  })

  // Update RGB values when selected color changes
  useEffect(() => {
    const rgb = hexToRgb(selectedColor)
    if (rgb) {
      setRgbValues(rgb)
      rgbForm.setValue("r", rgb.r)
      rgbForm.setValue("g", rgb.g)
      rgbForm.setValue("b", rgb.b)
    }
  }, [selectedColor, rgbForm])

  // Update hex form when selected color changes
  useEffect(() => {
    hexForm.setValue("hexColor", selectedColor)
  }, [selectedColor, hexForm])

  // Handle hex form submission
  const onHexSubmit = (data: z.infer<typeof hexFormSchema>) => {
    setSelectedColor(data.hexColor)
  }

  // Handle RGB form submission
  const onRgbSubmit = (data: z.infer<typeof rgbFormSchema>) => {
    const newColor = rgbToHex(data.r, data.g, data.b)
    setSelectedColor(newColor)
    setRgbValues({ r: data.r, g: data.g, b: data.b })
  }

  // Copy color to clipboard
  const copyToClipboard = () => {
    const colorValue = colorFormat === "hex" ? selectedColor : `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`

    navigator.clipboard.writeText(colorValue).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Color copied!",
        description: `${colorValue} has been copied to clipboard.`,
        duration: 2000,
      })
    })
  }

  // Determine if a color is light or dark (for text contrast)
  const isLightColor = (hex: string): boolean => {
    const rgb = hexToRgb(hex)
    if (!rgb) return false

    // Calculate relative luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
    return luminance > 0.5
  }

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      {/* Color Display */}
      <div
        className="h-32 rounded-lg mb-4 flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: selectedColor }}
      >
        <span className={cn("font-mono text-lg", isLightColor(selectedColor) ? "text-black" : "text-white")}>
          {colorFormat === "hex" ? selectedColor.toUpperCase() : `RGB(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`}
        </span>
      </div>

      {/* Color Format Toggle */}
      <div className="mb-4">
        <Tabs
          defaultValue="hex"
          value={colorFormat}
          onValueChange={(value) => setColorFormat(value as "hex" | "rgb")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hex" className="transition-all duration-200 hover:bg-muted/80">
              HEX
            </TabsTrigger>
            <TabsTrigger value="rgb" className="transition-all duration-200 hover:bg-muted/80">
              RGB
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hex" className="mt-4">
            <Form {...hexForm}>
              <form onSubmit={hexForm.handleSubmit(onHexSubmit)} className="space-y-4">
                <div className="flex space-x-2">
                  <FormField
                    control={hexForm.control}
                    name="hexColor"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            className="font-mono"
                            placeholder="#000000"
                            maxLength={7}
                            aria-label="Hex color value"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    aria-label={copied ? "Copied" : "Copy hex color value"}
                    className="transition-all duration-200 hover:bg-primary/10"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button type="submit" className="w-full transition-all duration-200">
                  Apply Color
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="rgb" className="mt-4">
            <Form {...rgbForm}>
              <form onSubmit={rgbForm.handleSubmit(onRgbSubmit)} className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={rgbForm.control}
                    name="r"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>R</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="255"
                            {...field}
                            className="font-mono"
                            aria-label="Red value"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={rgbForm.control}
                    name="g"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>G</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="255"
                            {...field}
                            className="font-mono"
                            aria-label="Green value"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={rgbForm.control}
                    name="b"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>B</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="255"
                            {...field}
                            className="font-mono"
                            aria-label="Blue value"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1 transition-all duration-200">
                    Apply Color
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    aria-label={copied ? "Copied" : "Copy RGB color value"}
                    className="transition-all duration-200 hover:bg-primary/10"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preset Colors */}
      <div>
        <h3 className="text-sm font-medium mb-2">Preset Colors</h3>
        {presetColors.length > 0 ? (
          <div className="grid grid-cols-7 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-full aspect-square rounded-md border-2 transition-all duration-200",
                  selectedColor === color ? "border-primary" : "border-transparent",
                  "hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                )}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setSelectedColor(color)
                  hexForm.setValue("hexColor", color)
                  const rgb = hexToRgb(color)
                  if (rgb) {
                    setRgbValues(rgb)
                    rgbForm.setValue("r", rgb.r)
                    rgbForm.setValue("g", rgb.g)
                    rgbForm.setValue("b", rgb.b)
                  }
                }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No preset colors available.</p>
        )}
      </div>
    </div>
  )
}

