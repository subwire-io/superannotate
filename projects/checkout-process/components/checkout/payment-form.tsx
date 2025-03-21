"use client"

import type React from "react"

interface PaymentFormData {
  cardName: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

interface PaymentFormProps {
  formData: PaymentFormData
  updateFormData: (data: Partial<PaymentFormData>) => void
}

export function PaymentForm({ formData, updateFormData }: PaymentFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="cardName" className="block text-sm font-medium mb-1">
            Name on Card
          </label>
          <input
            id="cardName"
            name="cardName"
            type="text"
            value={formData.cardName}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          />
        </div>

        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
            Card Number
          </label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            inputMode="numeric"
            pattern="[0-9\s]{13,19}"
            placeholder="xxxx xxxx xxxx xxxx"
            value={formData.cardNumber}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
              Expiry Date
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="text"
              placeholder="MM/YY"
              pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium mb-1">
              CVV
            </label>
            <input
              id="cvv"
              name="cvv"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{3,4}"
              placeholder="123"
              value={formData.cvv}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
        </div>
      </div>
    </div>
  )
}

