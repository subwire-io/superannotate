"use client"

import { useState, useEffect } from "react"
import { Copy, Check, ChevronRight, Palette } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Preset gradients
const presets = [
  { name: "Sunset", startColor: "#FF512F", endColor: "#F09819" },
  { name: "Ocean", startColor: "#2E3192", endColor: "#1BFFFF" },
  { name: "Forest", startColor: "#134E5E", endColor: "#71B280" },
  { name: "Berry", startColor: "#8E2DE2", endColor: "#4A00E0" },
  { name: "Fire", startColor: "#FF416C", endColor: "#FF4B2B" },
]

// Direction options
const directions = [
  { value: "to right", label: "Horizontal" },
  { value: "to bottom", label: "Vertical" },
  { value: "to bottom right", label: "Diagonal" },
  { value: "to top right", label: "Reverse Diagonal" },
  { value: "circle", label: "Radial" },
]

// Form schema for custom colors
const customColorSchema = z.object({
  startColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code",
  }),
  endColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code",
  }),
  direction: z.string(),
})

export default function GradientGenerator() {
  const [activeTab, setActiveTab] = useState("presets")
  const [presetName, setPresetName] = useState("Sunset")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Form for custom colors
  const form = useForm<z.infer<typeof customColorSchema>>({
    resolver: zodResolver(customColorSchema),
    defaultValues: {
      startColor: "#FF512F",
      endColor: "#F09819",
      direction: "to right",
    },
  })

  // Get values from form
  const startColor =
    activeTab === "presets"
      ? presets.find((p) => p.name === presetName)?.startColor || "#FF512F"
      : form.watch("startColor")

  const endColor =
    activeTab === "presets" ? presets.find((p) => p.name === presetName)?.endColor || "#F09819" : form.watch("endColor")

  const direction = activeTab === "presets" ? form.watch("direction") : form.watch("direction")

  // Generate CSS gradient style
  const gradientStyle = {
    background:
      direction === "circle"
        ? `radial-gradient(circle, ${startColor}, ${endColor})`
        : `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  }

  // CSS code to display
  const cssCode =
    direction === "circle"
      ? `background: radial-gradient(circle, ${startColor}, ${endColor});`
      : `background: linear-gradient(${direction}, ${startColor}, ${endColor});`

  // Handle preset selection
  const handlePresetChange = (name: string) => {
    setPresetName(name)
    const preset = presets.find((p) => p.name === name)
    if (preset) {
      // Update form values when preset changes
      form.setValue("startColor", preset.startColor)
      form.setValue("endColor", preset.endColor)

      toast({
        title: "Preset Applied",
        description: `Applied the ${name} gradient preset`,
      })
    }
  }

  // Handle direction change in preset tab
  const handleDirectionChange = (value: string) => {
    form.setValue("direction", value)

    toast({
      title: "Direction Changed",
      description: `Gradient direction updated to ${directions.find((d) => d.value === value)?.label || value}`,
    })
  }

  // Handle form submission
  const onSubmit = (values: z.infer<typeof customColorSchema>) => {
    toast({
      title: "Custom Gradient Applied",
      description: "Your custom gradient has been applied",
    })
  }

  // Copy CSS to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode)
    setCopied(true)

    toast({
      title: "Copied!",
      description: "CSS code copied to clipboard",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  // Reset copied state when CSS changes
  useEffect(() => {
    setCopied(false)
  }, [cssCode])

  return (
    <div className="space-y-6">
      {/* Gradient Preview with CSS Code */}
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardContent className="p-0">
          <div
            className="w-full h-48 md:h-64 rounded-t-md transition-all duration-500 flex items-center justify-center"
            style={gradientStyle}
          >
            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-sm">
              <Palette className="mx-auto h-6 w-6 text-primary" />
              <p className="text-sm font-medium mt-1">{activeTab === "presets" ? presetName : "Custom Gradient"}</p>
            </div>
          </div>
          <div className="p-4 bg-muted/30 border-t flex justify-between items-center">
            <p className="font-mono text-sm overflow-x-auto">{cssCode}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="ml-2 flex-shrink-0"
              aria-label="Copy CSS code"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Combined Controls Area */}
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardContent className="pt-6">
          <Tabs defaultValue="presets" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="presets" className="flex-1">
                Presets
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex-1">
                Custom
              </TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-4">
              <RadioGroup
                value={presetName}
                onValueChange={handlePresetChange}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {presets.map((preset) => (
                  <div
                    key={preset.name}
                    className="flex items-center space-x-2 p-2 rounded-md transition-colors hover:bg-muted/50"
                  >
                    <RadioGroupItem value={preset.name} id={`preset-${preset.name}`} />
                    <Label htmlFor={`preset-${preset.name}`} className="flex items-center cursor-pointer w-full">
                      <div
                        className="w-8 h-8 rounded-full mr-2 border"
                        style={{ background: `linear-gradient(to right, ${preset.startColor}, ${preset.endColor})` }}
                      />
                      <span>{preset.name}</span>
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="pt-2">
                <Label htmlFor="preset-direction">Direction</Label>
                <Select value={direction} onValueChange={handleDirectionChange}>
                  <SelectTrigger id="preset-direction" className="mt-1">
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    {directions.map((dir) => (
                      <SelectItem key={dir.value} value={dir.value}>
                        {dir.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="custom">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Start Color */}
                    <FormField
                      control={form.control}
                      name="startColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: field.value }} />
                            <FormControl>
                              <input
                                type="color"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value)
                                }}
                                className="w-full h-8"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* End Color */}
                    <FormField
                      control={form.control}
                      name="endColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: field.value }} />
                            <FormControl>
                              <input
                                type="color"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value)
                                }}
                                className="w-full h-8"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Direction */}
                  <FormField
                    control={form.control}
                    name="direction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Direction</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {directions.map((dir) => (
                              <SelectItem key={dir.value} value={dir.value}>
                                {dir.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Apply Custom Gradient
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

