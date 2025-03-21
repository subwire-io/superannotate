"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Mock data for the product
const product = {
  name: "Premium Wireless Headphones",
  price: 249.99,
  rating: 4.5,
  reviewCount: 127,
  description:
    "Experience superior sound quality with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design for extended listening sessions.",
  images: ["/headphones-main.svg", "/headphones-side.svg", "/headphones-top.svg", "/headphones-detail.svg"],
  colors: [
    { name: "Black", value: "#000000" },
    { name: "Silver", value: "#C0C0C0" },
    { name: "Blue", value: "#0000FF" },
  ],
  specifications: [
    { name: "Connectivity", value: "Bluetooth 5.0, 3.5mm audio jack" },
    { name: "Battery Life", value: "Up to 30 hours" },
    { name: "Charging Time", value: "2 hours" },
    { name: "Driver Size", value: "40mm" },
    { name: "Frequency Response", value: "20Hz - 20kHz" },
    { name: "Weight", value: "250g" },
    { name: "Noise Cancellation", value: "Active Noise Cancellation (ANC)" },
  ],
  reviews: [
    {
      id: 1,
      author: "Alex Thompson",
      date: "October 15, 2024",
      rating: 5,
      comment:
        "These headphones have outstanding sound quality and the noise cancellation is exceptional. Battery life is as advertised and they're very comfortable for long listening sessions.",
    },
    {
      id: 2,
      author: "Jamie Wilson",
      date: "September 30, 2024",
      rating: 4,
      comment:
        "Great audio quality and comfortable fit. The battery lasts for days. The only drawback is that they're a bit heavier than expected, but not uncomfortable.",
    },
    {
      id: 3,
      author: "Taylor Reed",
      date: "September 18, 2024",
      rating: 4,
      comment:
        "The sound quality is fantastic, and the ANC works great. My only complaint is that the ear cushions get a bit warm after extended use.",
    },
  ],
}

export default function ProductDetailsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const { toast } = useToast()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  })

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} (${selectedColor.name}) added to your cart`,
    })
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    })
    setShowReviewForm(false)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain p-4"
                priority
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex space-x-2 overflow-auto py-1">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative aspect-square w-20 rounded-md border overflow-hidden ${index === currentImageIndex ? "ring-2 ring-primary" : ""}`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              <Badge className="ml-2">Free Shipping</Badge>
            </div>
          </div>

          <p className="text-gray-600">{product.description}</p>

          {/* Color Selection */}
          <div>
            <h2 className="text-sm font-medium text-gray-900">Color</h2>
            <div className="mt-2 flex items-center space-x-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  className={`relative h-8 w-8 rounded-full border ${selectedColor.name === color.name ? "ring-2 ring-primary ring-offset-2" : ""}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-500">Selected: {selectedColor.name}</p>
          </div>

          {/* Quantity Selection */}
          <div>
            <h2 className="text-sm font-medium text-gray-900">Quantity</h2>
            <div className="mt-2 flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={incrementQuantity} aria-label="Increase quantity">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button className="w-full" size="lg" onClick={addToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="specifications">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="specifications" className="mt-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="py-2 border-b">
                    <dt className="text-sm font-medium text-gray-500">{spec.name}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{spec.value}</dd>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Customer Reviews</h2>
                <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                  {showReviewForm ? "Cancel" : "Write a Review"}
                </Button>
              </div>

              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Your Review</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating })}
                          className="mr-1"
                        >
                          <Star
                            className={`h-6 w-6 ${rating <= newReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium mb-2">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      className="w-full p-2 border rounded-md"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit">Submit Review</Button>
                </form>
              )}

              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{review.author}</h3>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

