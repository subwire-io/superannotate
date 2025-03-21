"use client"

import { useState, useEffect } from "react"
import { PropertyFilters } from "./property-filters"
import { PropertyGrid } from "./property-grid"
import { PropertyMap } from "./property-map"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { properties } from "@/data/properties"
import type { Property, FilterOptions, SortOption } from "@/types/property"
import { ViewToggle } from "./view-toggle"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function RealEstateListing() {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties)
  const [view, setView] = useState<"grid" | "map">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>("default")
  const [favorites, setFavorites] = useState<string[]>([])
  const { toast } = useToast()

  const propertiesPerPage = 6

  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 2000000],
    bedrooms: "any",
    propertyType: "any",
  })

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem("propertyFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("propertyFavorites", JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      if (prev.includes(propertyId)) {
        // Remove from favorites
        const newFavorites = prev.filter((id) => id !== propertyId)

        toast({
          title: "Property removed from favorites",
          description: "This property has been removed from your favorites.",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFavorites((current) => [...current, propertyId])
              }}
            >
              Undo
            </Button>
          ),
        })

        return newFavorites
      } else {
        // Add to favorites
        toast({
          title: "Property added to favorites",
          description: "This property has been added to your favorites.",
        })
        return [...prev, propertyId]
      }
    })
  }

  useEffect(() => {
    // Simulate loading state when filters change
    const applyFilters = async () => {
      setIsLoading(true)

      // Artificial delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Apply filters
      let result = properties

      // Filter by price range
      result = result.filter(
        (property) => property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1],
      )

      // Filter by bedrooms
      if (filters.bedrooms !== "any") {
        result = result.filter((property) => property.bedrooms === Number.parseInt(filters.bedrooms))
      }

      // Filter by property type
      if (filters.propertyType !== "any") {
        result = result.filter((property) => property.type === filters.propertyType)
      }

      // Apply sorting
      if (sortOption !== "default") {
        result = [...result].sort((a, b) => {
          if (sortOption === "price-asc") return a.price - b.price
          if (sortOption === "price-desc") return b.price - a.price
          if (sortOption === "newest") return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime()
          return 0
        })
      }

      setFilteredProperties(result)
      setCurrentPage(1) // Reset to first page when filters change
      setIsLoading(false)
    }

    applyFilters()
  }, [filters, sortOption])

  // Calculate pagination
  const indexOfLastProperty = currentPage * propertiesPerPage
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty)
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Find Your Dream Home
      </motion.h1>

      <div className="flex flex-col space-y-6">
        <PropertyFilters filters={filters} setFilters={setFilters} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating results...
              </span>
            ) : (
              `${filteredProperties.length} properties found`
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="w-full sm:w-auto">
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-[180px]" aria-label="Sort properties">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ViewToggle view={view} setView={setView} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PropertyGrid
                properties={currentProperties}
                isLoading={isLoading}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />

              {totalPages > 1 && !isLoading && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            isActive={currentPage === index + 1}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PropertyMap properties={filteredProperties} favorites={favorites} onToggleFavorite={toggleFavorite} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

