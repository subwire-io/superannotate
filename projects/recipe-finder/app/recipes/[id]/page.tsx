"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowLeft, ChefHat, Utensils } from "lucide-react"
import { recipesData } from "@/lib/data"
import { notFound } from "next/navigation"

export default function RecipeDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const recipeId = Number.parseInt(params.id)

  const recipe = recipesData.find((r) => r.id === recipeId)

  if (!recipe) {
    notFound()
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <Button variant="ghost" className="mb-6 transition-colors hover:bg-secondary" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to recipes
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-lg overflow-hidden">
          <img
            src={recipe.image || "/placeholder.svg"}
            alt={`Photo of ${recipe.title}`}
            className="w-full h-auto object-cover aspect-video"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/400x300/cccccc/666666?text=Image+Not+Found"
            }}
          />
        </div>

        <Card className="transition-all duration-200 hover:shadow-sm">
          <CardHeader className="pb-2 md:pb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <CardTitle className="text-2xl md:text-3xl">{recipe.title}</CardTitle>
              <Badge variant="outline" className="self-start">
                {recipe.cuisine}
              </Badge>
            </div>
            <CardDescription className="text-base mt-2">{recipe.description}</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">Prep: {recipe.prepTime} min</span>
              </div>
              <div className="flex items-center">
                <ChefHat className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">Cook: {recipe.cookTime} min</span>
              </div>
              <div className="flex items-center">
                <Utensils className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">Total: {recipe.prepTime + recipe.cookTime} min</span>
              </div>
            </div>

            {recipe.dietaryRestrictions.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Dietary Information:</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.dietaryRestrictions.map((diet) => (
                    <Badge
                      key={diet}
                      variant="secondary"
                      className="transition-colors hover:bg-secondary/80 text-sm py-1"
                    >
                      {diet}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mt-10">
        <Card className="transition-all duration-200 hover:shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="transition-colors hover:text-primary pl-2">
                  {ingredient}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-5">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="pl-2 transition-colors hover:text-primary">
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

