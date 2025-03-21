import type { GalleryImage } from "@/components/image-gallery"

// Nature category images with distinct SVG placeholders
const natureImages: GalleryImage[] = [
  {
    id: 1,
    src: "/images/nature-mountain.svg",
    alt: "Mountain landscape",
    caption: "Beautiful mountain landscape with a lake",
    category: "Nature",
  },
  {
    id: 2,
    src: "/images/nature-ocean.svg",
    alt: "Ocean sunset",
    caption: "Sunset over the ocean horizon",
    category: "Nature",
  },
  {
    id: 3,
    src: "/images/nature-forest.svg",
    alt: "Forest",
    caption: "Dense forest with sunlight streaming through the trees",
    category: "Nature",
  },
  {
    id: 4,
    src: "/images/nature-desert.svg",
    alt: "Desert",
    caption: "Desert landscape with cactus plants",
    category: "Nature",
  },
  {
    id: 5,
    src: "/images/nature-snow.svg",
    alt: "Snowy mountains",
    caption: "Snowy mountains under clear blue sky",
    category: "Nature",
  },
]

// City category images with distinct SVG placeholders
const cityImages: GalleryImage[] = [
  {
    id: 1,
    src: "/images/city-newyork.svg",
    alt: "New York skyline",
    caption: "New York City skyline at night",
    category: "City",
  },
  {
    id: 2,
    src: "/images/city-tokyo.svg",
    alt: "Tokyo street",
    caption: "Busy street in Tokyo with neon lights",
    category: "City",
  },
  {
    id: 3,
    src: "/images/city-paris.svg",
    alt: "Paris",
    caption: "Eiffel Tower in Paris, France",
    category: "City",
  },
]

// Abstract category images with distinct SVG placeholders
const abstractImages: GalleryImage[] = [
  {
    id: 1,
    src: "/images/abstract-waves.svg",
    alt: "Abstract waves",
    caption: "Colorful abstract wave patterns",
    category: "Abstract",
  },
  {
    id: 2,
    src: "/images/abstract-geometric.svg",
    alt: "Geometric shapes",
    caption: "Geometric abstract composition",
    category: "Abstract",
  },
  {
    id: 3,
    src: "/images/abstract-fluid.svg",
    alt: "Fluid art",
    caption: "Fluid abstract art with vibrant colors",
    category: "Abstract",
  },
]

export const galleryData = {
  nature: natureImages,
  city: cityImages,
  abstract: abstractImages,
  all: [...natureImages, ...cityImages, ...abstractImages],
}

