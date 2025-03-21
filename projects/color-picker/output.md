### Color selector Project

<ReactProject id="color-selector">

First, let's create our main color selector component:
```tsx file="components/color-selector.tsx"
"use client"

import { useState, useEffect } from "react"
import { Check, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// Convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

// Form schemas
const hexFormSchema = z.object({
  hexColor: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Must be a valid hex color (e.g., #FF0000)",
    }),
})

const rgbFormSchema = z.object({
  r: z.coerce.number().min(0).max(255),
  g: z.coerce.number().min(0).max(255),
  b: z.coerce.number().min(0).max(255),
})

export default function Colorselector() {
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
    const colorValue = colorFormat === "hex" 
      ? selectedColor 
      : `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`
    
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
        <span className={cn(
          "font-mono text-lg",
          isLightColor(selectedColor) ? "text-black" : "text-white"
        )}>
          {colorFormat === "hex" 
            ? selectedColor.toUpperCase() 
            : `RGB(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`
          }
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
            <TabsTrigger value="hex" className="transition-all duration-200 hover:bg-muted/80">HEX</TabsTrigger>
            <TabsTrigger value="rgb" className="transition-all duration-200 hover:bg-muted/80">RGB</TabsTrigger>
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
                <Button 
                  type="submit" 
                  className="w-full transition-all duration-200"
                >
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
                  <Button 
                    type="submit" 
                    className="flex-1 transition-all duration-200"
                  >
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
                  "hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
          <p className="text-sm text-muted-foreground text-center py-4">
            No preset colors available.
          </p>
        )}
      </div>
    </div>
  )
}
```

Next, let's create our main page component:

```typescriptreact
import Colorselector from "@/components/color-selector"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <h1 className="text-3xl font-bold mb-8 text-center">Color selector</h1>
      <Colorselector />
    </main>
  )
}
```

Finally, let's update the main layout to include the context and the navigation bar:

```typescriptreact
import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Color selector",
  description: "A simple color selector with preset colors and custom input",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Utilities

Let's create our utility functions for class name merging:

```typescriptreact
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Styles

Next, let's set up our global CSS with Tailwind configurations:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Configuration

Let's add our Tailwind configuration:

```typescriptreact
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

</ReactProject>