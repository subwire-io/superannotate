"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface ShippingData {
  fullName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentData {
  cardName: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

interface OrderSummaryProps {
  orderItems: OrderItem[]
  total: number
  shippingData: ShippingData
  paymentData: PaymentData
}

export function OrderSummary({ orderItems, total, shippingData, paymentData }: OrderSummaryProps) {
  const router = useRouter()

  if (orderItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some items to your cart to proceed with checkout</p>
        <Button onClick={() => router.push("/")} className="transition-colors hover:bg-primary/90">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div>
        <h3 className="font-medium text-lg mb-3">Order Items</h3>
        <div className="border rounded-md">
          <div className="px-4 py-3 border-b bg-muted/50">
            <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground">
              <span className="col-span-6">Product</span>
              <span className="col-span-2 text-right">Price</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Subtotal</span>
            </div>
          </div>
          <div className="divide-y">
            {orderItems.map((item) => (
              <div key={item.id} className="px-4 py-3 transition-colors hover:bg-muted/20">
                <div className="grid grid-cols-12 items-center">
                  <div className="col-span-6">
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="col-span-2 text-right">${item.price.toFixed(2)}</div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-2 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t bg-muted/50">
            <div className="grid grid-cols-12 items-center">
              <div className="col-span-8 sm:col-span-10 text-right font-medium">Total</div>
              <div className="col-span-4 sm:col-span-2 text-right font-bold">${total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div>
        <h3 className="font-medium text-lg mb-3">Shipping Information</h3>
        <div className="border rounded-md p-4 space-y-2 transition-colors hover:bg-muted/10">
          <p className="font-medium">{shippingData.fullName}</p>
          <p>{shippingData.address}</p>
          <p>
            {shippingData.city}, {shippingData.state} {shippingData.zipCode}
          </p>
          <p>{shippingData.country}</p>
        </div>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="font-medium text-lg mb-3">Payment Method</h3>
        <div className="border rounded-md p-4 space-y-2 transition-colors hover:bg-muted/10">
          <p className="font-medium">{paymentData.cardName}</p>
          <p>Credit Card ending in {paymentData.cardNumber ? `**** ${paymentData.cardNumber.slice(-4)}` : "****"}</p>
          <p>Expiry Date: {paymentData.expiryDate}</p>
        </div>
      </div>
    </div>
  )
}

