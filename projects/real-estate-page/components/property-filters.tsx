"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Slider } from "@/components/ui/slider"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { FilterOptions } from "@/types/property"
import { formatPrice } from "@/lib/utils"
import { motion } from "framer-motion"

interface PropertyFiltersProps {
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
}

const formSchema = z.object({
  priceRange: z.tuple([z.number(), z.number()]),
  bedrooms: z.string(),
  propertyType: z.string(),
})

export function PropertyFilters({ filters, setFilters }: PropertyFiltersProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priceRange: filters.priceRange,
      bedrooms: filters.bedrooms,
      propertyType: filters.propertyType,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFilters(values)
  }

  // Update form when slider changes
  const handlePriceChange = (value: number[]) => {
    form.setValue("priceRange", [value[0], value[1]], { shouldValidate: true })
    // Auto-submit form when slider changes
    form.handleSubmit(onSubmit)()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="priceRange"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="font-medium">Price Range</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Slider
                            defaultValue={field.value}
                            max={2000000}
                            step={50000}
                            onValueChange={handlePriceChange}
                            className="mt-6"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{formatPrice(field.value[0])}</span>
                            <span>{formatPrice(field.value[1])}</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="font-medium">Bedrooms</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          // Auto-submit form when selection changes
                          setTimeout(() => form.handleSubmit(onSubmit)(), 0)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all hover:border-primary focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="font-medium">Property Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          // Auto-submit form when selection changes
                          setTimeout(() => form.handleSubmit(onSubmit)(), 0)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all hover:border-primary focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="hidden">
                <Button type="submit">Apply Filters</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

