import Image from 'next/image'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Product } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface TopProductsProps {
  products: Product[]
  limit?: number
  className?: string
}

export function TopProducts({ products, limit = 5, className }: TopProductsProps) {
  // Sort products by sales and take the top ones
  const topProducts = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>Products with the highest number of sales</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {topProducts.map((product) => (
            <div key={product.id} className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover"
                  fill
                  sizes="64px"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium leading-none">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatNumber(product.sales)} sold</div>
                <div className="text-sm text-muted-foreground">{formatCurrency(product.price)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
