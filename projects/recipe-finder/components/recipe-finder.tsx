"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Search, Clock, X } from "lucide-react"
import { type Recipe, recipesData, cuisineTypes, dietaryOptions } from "@/lib/data"

// Form schema
const searchFormSchema = z.object({
  searchTerm: z.string(),
})

// RecipeCard component
const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md hover:scale-[1.01] cursor-pointer">
      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
        <img
          src={recipe.image || "/placeholder.svg"}
          alt={`Photo of ${recipe.title}`}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/400x300/cccccc/666666?text=Image+Not+Found"
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{recipe.title}</CardTitle>
          <Badge variant="outline">{recipe.cuisine}</Badge>
        </div>
        <CardDescription>{recipe.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 flex-1">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{recipe.prepTime + recipe.cookTime} min</span>
        </div>
        {recipe.dietaryRestrictions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.dietaryRestrictions.map((diet) => (
              <Badge key={diet} variant="secondary" className="text-xs">
                {diet}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full transition-colors hover:bg-primary hover:text-primary-foreground"
          asChild
        >
          <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Main RecipeFinder component
export default function RecipeFinder() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("All")
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipesData)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize form
  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      searchTerm: "",
    },
  })

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Filter recipes when filters change
  useEffect(() => {
    let results = recipesData

    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by cuisine
    if (selectedCuisine !== "All") {
      results = results.filter((recipe) => recipe.cuisine === selectedCuisine)
    }

    // Filter by dietary restrictions
    if (selectedDietary.length > 0) {
      results = results.filter((recipe) =>
        selectedDietary.every((restriction) => recipe.dietaryRestrictions.includes(restriction)),
      )
    }

    setFilteredRecipes(results)
  }, [searchTerm, selectedCuisine, selectedDietary])

  // Handle search form submission
  function onSearchSubmit(data: z.infer<typeof searchFormSchema>) {
    setSearchTerm(data.searchTerm)
  }

  // Toggle dietary restriction
  const toggleDietary = (value: string) => {
    setSelectedDietary((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    form.reset({ searchTerm: "" })
    setSelectedCuisine("All")
    setSelectedDietary([])
  }

  if (isLoading) {
    return (
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <header>
            <h1 className="text-3xl font-bold tracking-tight">Recipe Finder</h1>
            <p className="text-muted-foreground mt-1">Find delicious recipes filtered by cuisine and dietary needs</p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            <div className="h-10 bg-muted rounded-md"></div>
            <div className="h-10 bg-muted rounded-md"></div>
            <div className="sm:col-span-2 h-20 bg-muted rounded-md"></div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Recipe Finder</h1>
          <p className="text-muted-foreground mt-1">Find delicious recipes filtered by cuisine and dietary needs</p>
        </header>

        {/* Filters Section */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSearchSubmit)} className="relative">
                <FormField
                  control={form.control}
                  name="searchTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search recipes..."
                            className="pl-8"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setSearchTerm(e.target.value)
                            }}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <button type="submit" className="sr-only">
                  Search
                </button>
              </form>
            </Form>
          </div>

          <div>
            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger className="transition-colors hover:border-primary">
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent>
                {cuisineTypes.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine} className="transition-colors cursor-pointer hover:bg-muted">
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <div className="flex flex-wrap gap-4 p-4 border rounded-md">
              <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Dietary Restrictions:
              </span>
              <div className="flex flex-wrap gap-4">
                {dietaryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2 group">
                    <Checkbox
                      id={option}
                      checked={selectedDietary.includes(option)}
                      onCheckedChange={() => toggleDietary(option)}
                      className="transition-colors data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <label
                      htmlFor={option}
                      className="text-sm font-medium leading-none cursor-pointer transition-colors group-hover:text-primary"
                    >
                      {option}
                    </label>
                  </div>
                ))}
                {selectedDietary.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDietary([])}
                    aria-label="Clear dietary filters"
                    className="transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Applied filters */}
        {(searchTerm || selectedCuisine !== "All" || selectedDietary.length > 0) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Applied filters:</span>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchTerm}
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      form.reset({ searchTerm: "" })
                    }}
                    className="ml-1 rounded-full hover:bg-muted p-0.5 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCuisine !== "All" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Cuisine: {selectedCuisine}
                  <button
                    onClick={() => setSelectedCuisine("All")}
                    className="ml-1 rounded-full hover:bg-muted p-0.5 transition-colors"
                    aria-label="Clear cuisine filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedDietary.map((diet) => (
                <Badge key={diet} variant="secondary" className="flex items-center gap-1">
                  {diet}
                  <button
                    onClick={() => toggleDietary(diet)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5 transition-colors"
                    aria-label={`Remove ${diet} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-7 gap-1 transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                Reset all
              </Button>
            </div>
          </div>
        )}

        {/* Recipe grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-medium">No recipes found</p>
            <p className="text-muted-foreground mt-1">Try adjusting your filters</p>
            <Button className="mt-4 transition-colors hover:bg-primary/90" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

