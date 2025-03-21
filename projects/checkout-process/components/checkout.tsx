"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react"
import { ShippingForm } from "./checkout/shipping-form"
import { PaymentForm } from "./checkout/payment-form"
import { OrderSummary } from "./checkout/order-summary"
import { CheckoutSteps } from "./checkout/checkout-steps"
import { useRouter } from "next/navigation"

// Main checkout component that orchestrates the multi-step process
export default function Checkout() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    shipping: {
      fullName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    payment: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  })

  // Mock order data
  const orderItems = [
    { id: 1, name: "Premium Headphones", price: 249.99, quantity: 1 },
    { id: 2, name: "Wireless Charging Pad", price: 49.99, quantity: 1 },
    { id: 3, name: "USB-C Cable (3m)", price: 19.99, quantity: 2 },
  ]

  const steps = [
    { id: "shipping", title: "Shipping Information" },
    { id: "payment", title: "Payment Details" },
    { id: "review", title: "Review Order" },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const updateFormData = (step, data) => {
    setFormData({
      ...formData,
      [step]: {
        ...formData[step],
        ...data,
      },
    })
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleSubmitOrder = () => {
    // In a real application, this would submit the order to a backend API
    alert("Order submitted successfully!")
    // Reset form or redirect to confirmation page
  }

  // Check if cart is empty
  const isCartEmpty = orderItems.length === 0

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      {isCartEmpty ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some items to your cart to proceed with checkout</p>
            <Button onClick={() => router.push("/")} className="transition-colors hover:bg-primary/90">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Checkout Steps Indicator */}
          <CheckoutSteps steps={steps} currentStep={currentStep} />

          {/* Current Step Form */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>
                {currentStep === 0 && "Please enter your shipping information"}
                {currentStep === 1 && "Enter your payment details securely"}
                {currentStep === 2 && "Review your order before finalizing"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 0 && (
                <ShippingForm
                  formData={formData.shipping}
                  updateFormData={(data) => updateFormData("shipping", data)}
                  onNext={handleNext}
                />
              )}
              {currentStep === 1 && (
                <PaymentForm
                  formData={formData.payment}
                  updateFormData={(data) => updateFormData("payment", data)}
                  onNext={handleNext}
                />
              )}
              {currentStep === 2 && (
                <OrderSummary
                  orderItems={orderItems}
                  total={calculateTotal()}
                  shippingData={formData.shipping}
                  paymentData={formData.payment}
                />
              )}

              {/* Navigation Buttons */}
              <div className={`flex ${currentStep === 0 ? "justify-end" : "justify-between"} mt-8`}>
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex items-center transition-colors hover:bg-accent"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="flex items-center transition-colors hover:bg-primary/90"
                    type="submit"
                    form={currentStep === 0 ? "shipping-form" : "payment-form"}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmitOrder} className="transition-colors hover:bg-primary/90">
                    Complete Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

